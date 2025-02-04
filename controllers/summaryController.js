const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getSummary = async (req, res) => {
  try {
    // Ambil query parameter bulan dan tahun
    const { bulan, tahun } = req.query;

    const today = new Date();
    const selectedBulan = bulan ? parseInt(bulan) - 1 : today.getMonth();
    const selectedTahun = tahun ? parseInt(tahun) : today.getFullYear();

    const startOfMonth = new Date(Date.UTC(selectedTahun, selectedBulan, 1));
    const endOfMonth = new Date(
      Date.UTC(selectedTahun, selectedBulan + 1, 0, 23, 59, 59)
    );

    // console.log("startOfMonth:", startOfMonth, "endOfMonth:", endOfMonth);

    // Hitung jumlah transaksi
    const transactionCount = await prisma.transaksi.count({
      where: {
        created_at: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Total pemasukan dan margin
    const totalIncome = await prisma.transaksi.aggregate({
      where: {
        created_at: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        total_transaksi: true,
        total_margin: true,
      },
    });

    // Total stok dan jumlah produk
    const produkSummary = await prisma.produk.aggregate({
      _sum: {
        stok: true,
      },
      _count: {
        id_produk: true,
      },
    });

    // Total item terjual (stok log)
    const totalStockLogs = await prisma.stockLog.findMany({
      where: {
        change_type: "penjualan",
        created_at: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
    const totalStockSold = totalStockLogs.reduce(
      (total, log) => total + Math.abs(log.jumlah),
      0
    );

    // Ambil data transaksi
    const transaksi = await prisma.transaksi.findMany({
      where: {
        created_at: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        detailTransaksi: {
          include: {
            produk: true,
          },
        },
      },
    });

    // Ambil data kategori
    const kategoriList = await prisma.kategori.findMany();
    const kategoriMap = kategoriList.reduce((map, kategori) => {
      map[kategori.id_kategori] = kategori.nama_kategori;
      return map;
    }, {});

    // Tambahkan fallback untuk kategori yang tidak diketahui
    const kategoriCount = transaksi.reduce((acc, trx) => {
      trx.detailTransaksi.forEach((detail) => {
        const kategoriId = detail.produk.id_kategori;
        const kategoriName = kategoriMap[kategoriId] || "Tidak Diketahui"; // Tambahkan fallback

        if (!acc[kategoriName]) {
          acc[kategoriName] = { jumlah: 0, total_pemasukan: 0 };
        }

        const jumlahTerjual = detail.jumlah;
        const hargaJual =
          trx.metode_bayar === 1
            ? detail.harga_jual_cash
            : detail.harga_jual_kredit;

        acc[kategoriName].jumlah += jumlahTerjual;
        acc[kategoriName].total_pemasukan += jumlahTerjual * hargaJual;
      });
      return acc;
    }, {});



    const totalJumlahKategori = Object.values(kategoriCount).reduce(
      (sum, kategori) => sum + kategori.jumlah,
      0
    );

    const kategoriData = Object.entries(kategoriCount).map(
      ([kategori, data]) => ({
        kategori,
        jumlah: data.jumlah,
        total_pemasukan: data.total_pemasukan,
        persentase: ((data.jumlah / totalStockSold) * 100).toFixed(1), // Perbaiki basis persentase
      })
    );

    // Data Bulanan
    const monthlyLogs = totalStockLogs.reduce((acc, log) => {
      const date = new Date(log.created_at).toLocaleDateString("id-ID");
      if (!acc[date]) acc[date] = 0;
      acc[date] += Math.abs(log.jumlah);
      return acc;
    }, {});

    const formattedMonthlyData = Object.entries(monthlyLogs).map(
      ([tanggal, jumlah]) => ({
        tanggal,
        jumlah,
      })
    );

    const totalKategoriTerjual = kategoriData.reduce(
      (sum, kategori) => sum + kategori.jumlah,
      0
    );
    
    const summary = {
      total_pemasukan: totalIncome._sum.total_transaksi || 0,
      total_margin: totalIncome._sum.total_margin || 0,
      total_transaksi: transactionCount,
      total_stok: produkSummary._sum.stok || 0,
      total_produk: produkSummary._count.id_produk || 0,
      total_item_terjual: totalKategoriTerjual, // Gunakan hasil dari kategori
      startOfMonth,
      endOfMonth,
    };
    res.status(200).json({
      status: 200,
      message: "Summary data retrieved successfully!",
      data: summary,
      kategoriProduk: kategoriData,
      penjualanBulanan: formattedMonthlyData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
