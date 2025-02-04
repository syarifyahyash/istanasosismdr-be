const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk membuat detail transaksi
exports.createDetailTransaksi = async (req, res) => {
  const { id_transaksi, id_produk, jumlah } = req.body;

  try {
    // Mengambil harga_beli dari tabel produk berdasarkan id_produk
    const produk = await prisma.produk.findUnique({
      where: { id_produk: id_produk },
    });

    if (!produk) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    const margin = produk.harga_beli * 0.1; // Margin 10% dari harga_beli
    let harga_jual_cash, harga_jual_kredit, margin_toko_kredit, shu_orang, shu_toko;

    // Menentukan harga jual dan margin berdasarkan metode_bayar transaksi
    const transaksi = await prisma.transaksi.findUnique({
      where: { id_transaksi },
    });

    if (transaksi.metode_bayar === 'CASH') {
      harga_jual_cash = produk.harga_beli + margin;
      harga_jual_kredit = null;
      margin_toko_kredit = null;
      shu_orang = null;
      shu_toko = null;
    } else if (transaksi.metode_bayar === 'KREDIT') {
      harga_jual_cash = produk.harga_beli + margin;
      harga_jual_kredit = harga_jual_cash + (0.01 * produk.harga_beli);
      margin_toko_kredit = harga_jual_kredit - produk.harga_beli;
      shu_orang = 0.01 * harga_jual_kredit;
      shu_toko = margin - shu_orang;
    }

    // Simpan detail transaksi
    const newDetailTransaksi = await prisma.detailTransaksi.create({
      data: {
        id_transaksi,
        id_produk,
        jumlah,
        harga_beli: produk.harga_beli,
        harga_jual_cash,
        harga_jual_kredit,
        margin,
        margin_toko_kredit,
        shu_orang,
        shu_toko,
      },
    });

    res.status(201).json(newDetailTransaksi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat detail transaksi' });
  }
};

// Fungsi untuk mendapatkan semua detail transaksi
exports.getAllDetailTransaksi = async (req, res) => {
  try {
    const detailTransaksi = await prisma.detailTransaksi.findMany({
      include: {
        transaksi: true,
        produk: true,
      },
      orderBy: { id_detail_transaksi: 'desc' },
    });
    res.json({
      status: 200,
      message: 'Detail transaksi ditampilkan!',
      data: detailTransaksi,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data detail transaksi.' });
  }
};

// Fungsi untuk mendapatkan detail transaksi berdasarkan ID
exports.getDetailTransaksiById = async (req, res) => {
  const { id } = req.params;

  try {
    const detailTransaksi = await prisma.detailTransaksi.findUnique({
      where: { id_detail_transaksi: parseInt(id) },
    });

    if (!detailTransaksi) {
      return res.status(404).json({
        status: 404,
        message: `Detail transaksi dengan ID ${id} tidak ditemukan.`,
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Detail transaksi berhasil ditemukan!',
      data: detailTransaksi,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan saat mengambil data detail transaksi.',
    });
  }
};

// Fungsi untuk memperbarui detail transaksi berdasarkan ID
exports.updateDetailTransaksi = async (req, res) => {
  const { id } = req.params;
  const { id_transaksi, id_produk, jumlah, harga_beli, harga_jual } = req.body;

  try {
    const updatedDetailTransaksi = await prisma.detailTransaksi.update({
      where: { id_detail_transaksi: parseInt(id) },
      data: {
        id_transaksi,
        id_produk,
        jumlah,
        harga_beli,
        harga_jual,
      },
    });

    res.status(200).json({
      status: 200,
      message: 'Detail transaksi berhasil diperbarui!',
      data: updatedDetailTransaksi,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan saat memperbarui detail transaksi.',
    });
  }
};

// Fungsi untuk menghapus detail transaksi berdasarkan ID
exports.deleteDetailTransaksi = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.detailTransaksi.delete({
      where: { id_detail_transaksi: parseInt(id) },
    });

    res.status(200).json({
      status: 200,
      message: 'Detail transaksi berhasil dihapus!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan saat menghapus detail transaksi.',
    });
  }
};
