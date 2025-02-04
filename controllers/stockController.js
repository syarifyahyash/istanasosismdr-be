const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createStockLog = async (req, res) => {
  const { id_produk, performed_by, change_type, jumlah } = req.body;

  try {
    const newStockLog = await prisma.stockLog.create({
      data: {
        id_produk,
        performed_by,
        change_type,
        jumlah,
      },
    });
    res.status(201).json({
      status: 201,
      message: 'Log stok ditambahkan!',
      data: newStockLog,
    });
  } catch (error) {
    console.error(error); // Debug jika ada kesalahan
    res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan log stok.' });
  }
};

exports.getAllStockLog = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Ambil page dan limit dari query, default 1 dan 10
    const offset = (page - 1) * limit; // Hitung offset berdasarkan page dan limit
    const take = parseInt(limit); // Ambil sejumlah limit data

    // Ambil log stok dengan pagination
    const stockLogs = await prisma.stockLog.findMany({
      skip: parseInt(offset), // Lewati data hingga offset
      take, // Ambil sejumlah limit data
      include: {
        user: {
          select: {
            id_user: true,
            name: true,
          },
        }, // Sertakan informasi user
        produk: {
          select: {
            id_produk: true,
            nama_produk: true,
          },
        }, // Sertakan informasi produk
      },
      orderBy: {
        id_log: 'desc', // Urutkan berdasarkan ID log stok secara descending
      },
    });

    // Hitung total data
    const totalData = await prisma.stockLog.count();

    // Hitung total halaman
    const totalPages = Math.ceil(totalData / limit);

    // Kirimkan data log stok dan metadata pagination
    res.status(200).json({
      status: 200,
      message: 'Semua log stok ditampilkan!',
      meta: {
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
      data: stockLogs,
    });
  } catch (error) {
    console.error(error); // Debug jika ada kesalahan
    res.status(500).json({
      error: 'Terjadi kesalahan saat mengambil semua log stok.',
    });
  }
};


exports.getStockLogById = async (req, res) => {
  const { id } = req.params;

  try {
    const stockLog = await prisma.stockLog.findUnique({
      where: { id_log: parseInt(id) },
    });

    if (!stockLog) {
      return res.status(404).json({ error: `Log stok dengan ID ${id} tidak ditemukan.` });
    }

    res.status(200).json({
      status: 200,
      message: 'Log stok ditemukan!',
      data: stockLog,
    });
  } catch (error) {
    console.error(error); // Debug jika ada kesalahan
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil log stok berdasarkan ID.' });
  }
};

exports.updateStockLog = async (req, res) => {
  const { id } = req.params;
  const { id_produk, performed_by, change_type, jumlah } = req.body;

  try {
    const updatedStockLog = await prisma.stockLog.update({
      where: { id_log: parseInt(id) },
      data: {
        id_produk,
        performed_by,
        change_type,
        jumlah,
      },
    });

    res.status(200).json(updatedStockLog);
  } catch (error) {
    console.error(error); // Debug jika ada kesalahan
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui log stok.' });
  }
};

exports.deleteStockLog = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStockLog = await prisma.stockLog.delete({
      where: { id_log: parseInt(id) },
    });

    res.status(200).json(deletedStockLog);
  } catch (error) {
    console.error(error); // Debug jika ada kesalahan
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus log stok.' });
  }
};
