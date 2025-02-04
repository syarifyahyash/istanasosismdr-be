const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fungsi untuk menambahkan produk baru
exports.createProduk = async (req, res) => {
  const {
    id_kategori,
    nama_produk,
    barcode,
    unit,
    harga_beli,
    margin,
    margin_kredit,
    harga_jual_cash,
    harga_jual_kredit,
    stok,
  } = req.body;

  try {
    const newProduk = await prisma.produk.create({
      data: {
        id_kategori,
        nama_produk,
        barcode,
        unit,
        harga_beli,
        margin,
        margin_kredit,
        harga_jual_cash,
        harga_jual_kredit,
        stok,
      },
    });
    res.status(201).json({
      status: 201,
      message: "Produk berhasil ditambahkan!",
      data: newProduk,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat menambahkan produk." });
  }
};

// Fungsi untuk mendapatkan semua produk
exports.getAllProduk = async (req, res) => {
  try {
    const { page = 1, limit = 10, all = false } = req.query; // Ambil page dan limit dari query, default 1 dan 10
    const offset = (page - 1) * limit; // Hitung offset berdasarkan page dan limit
    let take = null;
    if (!all) {
      take = parseInt(limit); // Ambil sejumlah limit data
    }

    // Ambil produk dengan pagination
    const produks = await prisma.produk.findMany({
      skip: parseInt(offset), // Lewati data hingga offset
      take, // Ambil sejumlah limit data
      include: {
        kategori: true, // Join tabel kategori untuk menampilkan kategori produk
      },
      orderBy: {
        id_produk: "desc", // Urutkan berdasarkan ID produk secara descending
      },
    });

    // Hitung total data
    const totalData = await prisma.produk.count();

    // Hitung total halaman
    const totalPages = Math.ceil(totalData / limit);

    // Kirimkan data produk dan metadata pagination
    res.status(200).json({
      status: 200,
      message: "Daftar produk ditampilkan!",
      meta: {
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
      data: produks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan saat mengambil data produk.",
      error: error.message,
    });
  }
};

// Fungsi untuk mendapatkan produk berdasarkan ID
exports.getProdukById = async (req, res) => {
  const { id } = req.params;

  try {
    const produk = await prisma.produk.findUnique({
      where: { id_produk: parseInt(id) },
      include: {
        kategori: true, // Join tabel kategori untuk menampilkan detail kategori
      },
    });

    if (produk) {
      res.json({
        status: 200,
        message: "Produk ditemukan!",
        data: produk,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "Produk tidak ditemukan.",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil data produk." });
  }
};

// Fungsi untuk memperbarui produk berdasarkan ID
exports.updateProduk = async (req, res) => {
  const { id } = req.params;
  const {
    id_kategori,
    barcode,
    nama_produk,
    unit,
    harga_beli,
    margin,
    margin_kredit,
    harga_jual_cash,
    harga_jual_kredit,
    stok
  } = req.body;

  try {
    const updatedProduk = await prisma.produk.update({
      where: { id_produk: parseInt(id) },
      data: {
        id_kategori,
        barcode,
        nama_produk,
        unit,
        harga_beli,
        margin,
        margin_kredit,
        harga_jual_cash,
        harga_jual_kredit,
        stok
      },
    });

    res.json({
      status: 200,
      message: "Produk berhasil diperbarui!",
      data: updatedProduk,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat memperbarui produk." });
  }
};

exports.updateStokProduk = async (req, res) => {
  const { id } = req.params;
  const { stok, performed_by, change_type } = req.body;

  try {
    const updatedProduk = await prisma.produk.update({
      where: { id_produk: parseInt(id) },
      data: { stok },
    });

    res.json({
      status: 200,
      message: "Stok produk berhasil diperbarui!",
      data: updatedProduk,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat memperbarui stok produk." });
  }
};

// Fungsi untuk menghapus produk berdasarkan ID
exports.deleteProduk = async (req, res) => {
  const { id } = req.params;

  try {
    // Check for existing relationships in stockLog, transaksi, and detailTransaksi
    const stockLogs = await prisma.stockLog.findMany({
      where: { id_produk: parseInt(id) },
    });
    const transactions = await prisma.transaksi.findMany({
      where: { detailTransaksi: { some: { id_produk: parseInt(id) } } },
    });

    // If there are related records, prevent deletion
    if (stockLogs.length > 0 || transactions.length > 0) {
      return res.status(400).json({
        error: "Produk tidak dapat dihapus karena masih memiliki relasi dengan log stok atau transaksi.",
      });
    }

    // Proceed with deletion if no relationships exist
    const deletedProduk = await prisma.produk.delete({
      where: { id_produk: parseInt(id) },
    });

    res.json({
      status: 200,
      message: "Produk berhasil dihapus!",
      data: deletedProduk,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat menghapus produk." });
  }
};

