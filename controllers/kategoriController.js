const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk menambahkan kategori baru
exports.createKategori = async (req, res) => {
  const { nama_kategori } = req.body;

  try {
    const newKategori = await prisma.kategori.create({
      data: {
        nama_kategori,
      },
    });

    res.status(201).json({
      status: 201,
      message: 'Kategori berhasil ditambahkan!',
      data: newKategori,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan kategori.' });
  }
};


// Fungsi untuk mendapatkan semua kategori
exports.getAllKategori = async (req, res) => {
  try {
    const kategoris = await prisma.kategori.findMany({
      orderBy: [{ id_kategori: 'desc' }],
      include: {
        _count: {
          select: { produk: true },
        },
      },
    });
    const result = kategoris.map((kategori) => ({
      ...kategori,
      total_produk: kategori._count.produk,
    }));
    res.json({
      status: 200,
      message: 'Kategori ditampilkan!',
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data kategori.' });
  }
};

// Fungsi untuk mendapatkan kategori berdasarkan ID
exports.getKategoriById = async (req, res) => {
  const { id } = req.params;

  try {
    const kategori = await prisma.kategori.findUnique({
      where: { id_kategori: parseInt(id) },
    });

    if (kategori) {
      res.json({
        status: 200,
        message: 'Kategori ditemukan!',
        data: kategori,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: 'Kategori tidak ditemukan.',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data kategori.' });
  }
};

// Fungsi untuk memperbarui kategori berdasarkan ID
exports.updateKategori = async (req, res) => {
  const { id } = req.params;
  const { nama_kategori } = req.body;

  try {
    const updatedKategori = await prisma.kategori.update({
      where: { id_kategori: parseInt(id) },
      data: { nama_kategori },
    });

    res.json({
      status: 200,
      message: 'Kategori berhasil diperbarui!',
      data: updatedKategori,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui kategori.' });
  }
};

// Fungsi untuk menghapus kategori berdasarkan ID
exports.deleteKategori = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedKategori = await prisma.kategori.delete({
      where: { id_kategori: parseInt(id) },
    });

    res.json({
      status: 200,
      message: 'Kategori berhasil dihapus!',
      data: deletedKategori,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus kategori.' });
  }
};
