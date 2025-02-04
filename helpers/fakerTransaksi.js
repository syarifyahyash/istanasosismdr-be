const { faker } = require('@faker-js/faker');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();// Asumsi koneksi Prisma sudah diatur

faker.locale = 'id_ID';

// Fungsi untuk menghasilkan kode transaksi unik
async function generateKodeTransaksi(index) {
  const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

  const transactionCount = await prisma.transaksi.count({
    where: {
      created_at: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });

  const uniqueSuffix = (transactionCount + index + 1).toString().padStart(4, "0"); // 0001, 0002, dst.
  return `INV-${formattedDate}-${uniqueSuffix}`;
}

// Fungsi untuk membuat detail transaksi dengan data produk dari database
async function generateDetailTransaksi() {
  const detailCount = faker.number.int({ min: 1, max: 5 }); // Maksimal 5 produk per transaksi
  const detailTransaksi = [];

  for (let i = 0; i < detailCount; i++) {
    const id_produk = faker.number.int({ min: 1, max: 6 }); // Produk dari ID 1 sampai 6
    const jumlah = faker.number.int({ min: 1, max: 5 }); // Jumlah produk 1–5 unit

    // Ambil detail produk dari database
    const produk = await prisma.produk.findUnique({
      where: { id_produk },
    });

    if (!produk) {
      throw new Error(`Produk dengan ID ${id_produk} tidak ditemukan.`);
    }

    const {
      harga_beli,
      margin,
      harga_jual_cash,
      harga_jual_kredit,
      stok,
    } = produk;

    const metode_bayar = 2; // Default ke KREDIT
    let margin_toko_kredit = null;
    let shu_orang = null;
    let shu_toko = null;

    if (metode_bayar === 2) {
      // Kalkulasi untuk metode bayar KREDIT
      margin_toko_kredit = harga_jual_kredit - harga_beli;
      shu_orang = 0.01 * harga_jual_kredit;
      shu_toko = margin - shu_orang;
    }

    // Membuat Stock Log untuk mencatat perubahan stok
    await prisma.stockLog.create({
      data: {
        id_produk,
        performed_by: 2, // ID user yang melakukan penjualan, disesuaikan dengan data yang ada
        change_type: "penjualan",
        jumlah: -jumlah, // Mengurangi stok
      },
    });

    // Mengurangi stok produk
    await prisma.produk.update({
      where: { id_produk },
      data: { stok: stok - jumlah }, // Mengupdate stok produk setelah penjualan
    });

    detailTransaksi.push({
      id_produk,
      jumlah,
      harga_beli,
      harga_jual_cash,
      harga_jual_kredit,
      margin,
      margin_toko_kredit,
      shu_orang,
      shu_toko,
    });
  }

  return detailTransaksi;
}

// Fungsi untuk membuat transaksi dummy
async function generateDummyTransaksi(count) {
  const transaksi = [];

  for (let i = 0; i < count; i++) {
    const id_user = 2; // Gunakan ID user 2
    const id_member = faker.number.int({ min: 22, max: 31 }); // Member dari ID 22 sampai 31
    const metode_bayar = 2; // Default ke KREDIT

    // Generate kode transaksi
    const kode_transaksi = await generateKodeTransaksi(i);

    // Generate detail transaksi
    const detailTransaksi = await generateDetailTransaksi();

    // Hitung total transaksi dan total margin
    const total_transaksi = detailTransaksi.reduce(
      (acc, item) => acc + item.harga_jual_kredit * item.jumlah,
      0
    );
    const total_margin = detailTransaksi.reduce(
      (acc, item) => acc + (item.margin_toko_kredit || 0) * item.jumlah,
      0
    );

    transaksi.push({
      kode_transaksi,
      id_user,
      id_member,
      metode_bayar,
      total_transaksi,
      total_margin,
      detailTransaksi,
    });
  }

  return transaksi;
}

module.exports = {
  generateDummyTransaksi,
};
