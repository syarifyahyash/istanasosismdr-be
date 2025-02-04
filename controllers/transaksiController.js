const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createTransaksi = async (req, res) => {
  const { id_user, id_member, metode_bayar, detailTransaksi } = req.body;

  try {
    let total_transaksi = 0;
    let total_margin = 0;

    const calculatedDetailTransaksi = await Promise.all(
      detailTransaksi.map(async (item) => {
        const produk = await prisma.produk.findUnique({
          where: { id_produk: item.id_produk },
        });

        if (!produk) {
          throw new Error(
            `Produk dengan id ${item.id_produk} tidak ditemukan.`
          );
        }

        const { harga_beli, margin, harga_jual_cash, harga_jual_kredit, stok } =
          produk;
        let margin_toko_kredit, shu_orang, shu_toko, harga_jual;

        if (metode_bayar === 1) {
          harga_jual = harga_jual_cash;
          total_margin += margin * item.jumlah;
        } else if (metode_bayar === 2) {
          harga_jual = harga_jual_kredit;
          margin_toko_kredit = harga_jual_kredit - harga_beli;
          shu_orang = 0.01 * harga_jual_kredit;
          shu_toko = margin - shu_orang;
          total_margin += margin_toko_kredit * item.jumlah;
        }

        total_transaksi += harga_jual * item.jumlah;

        await prisma.stockLog.create({
          data: {
            id_produk: item.id_produk,
            performed_by: id_user,
            change_type: "penjualan",
            jumlah: -item.jumlah,
          },
        });

        await prisma.produk.update({
          where: { id_produk: item.id_produk },
          data: { stok: stok - item.jumlah },
        });

        return {
          id_produk: item.id_produk,
          jumlah: item.jumlah,
          harga_beli,
          harga_jual_cash,
          harga_jual_kredit,
          margin,
          margin_toko_kredit,
          shu_orang,
          shu_toko,
        };
      })
    );

    const generateKodeTransaksi = async () => {
      const date = new Date();
      const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, "");
      const randomSuffix = Math.floor(Math.random() * 1000000);
      const uniqueSuffix = randomSuffix.toString().padStart(6, "0");
      return `INV-${formattedDate}-${uniqueSuffix}`;
    };

    const kodeTransaksi = await generateKodeTransaksi();

    const metodeBayarExists = await prisma.metodeBayar.findUnique({
      where: { id_metode: metode_bayar },
    });

    if (!metodeBayarExists) {
      throw new Error(
        `Metode bayar dengan id ${metode_bayar} tidak ditemukan.`
      );
    }

    let sisa_hutang = 0;
    let statusTran = "lunas";

    if (metode_bayar === 2) {
      statusTran = "belum_lunas";
      sisa_hutang = total_transaksi;

      if (id_member) {
        const member = await prisma.memberKoperasi.findUnique({
          where: { id_member },
        });

        if (!member) {
          throw new Error(`Member dengan id ${id_member} tidak ditemukan.`);
        }

        await prisma.memberKoperasi.update({
          where: { id_member },
          data: {
            total_hutang: member.total_hutang + total_transaksi,
          },
        });
      }
    }

    const newTransaksi = await prisma.transaksi.create({
      data: {
        kode_transaksi: kodeTransaksi,
        id_user,
        id_member,
        metode_bayar,
        total_transaksi,
        sisa_hutang,
        total_margin,
        status_transaksi: statusTran,
        detailTransaksi: {
          create: calculatedDetailTransaksi,
        },
      },
    });

    res.json({
      status: 201,
      message: "Transaksi berhasil!",
      data: newTransaksi,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat membuat transaksi" });
  }
};

exports.getAllTransaksi = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      all = false,
      start_date,
      end_date,
    } = req.query;
    const offset = (page - 1) * limit;
    let take = null;

    if (!all) {
      take = parseInt(limit); // Ambil sejumlah limit data
    }

    // Filter berdasarkan tanggal
    let filter = {};
    if (start_date && end_date) {
      filter.created_at = {
        gte: new Date(start_date), // Greater than or equal to start_date
        lte: new Date(end_date), // Less than or equal to end_date
      };
    }

    // Ambil transaksi dengan filter dan pagination
    const transaksi = await prisma.transaksi.findMany({
      where: filter,
      skip: parseInt(offset),
      take,
      include: {
        detailTransaksi: true,
        user: {
          select: {
            id_user: true,
            name: true,
            role: true,
          },
        },
        member: {
          select: {
            id_member: true,
            npk: true,
            nama: true,
            jabatan: true,
            total_hutang: true,
          },
        },
      },
      orderBy: {
        id_transaksi: "desc",
      },
    });

    // Hitung total data berdasarkan filter
    const totalData = await prisma.transaksi.count({
      where: filter,
    });

    // Hitung total halaman
    const totalPages = Math.ceil(totalData / limit);

    // Hitung total transaksi
    const totalTransaksi = await prisma.transaksi.count();

    // Kirimkan data transaksi dan metadata pagination
    res.status(200).json({
      status: 200,
      message: "Daftar transaksi ditampilkan!",
      meta: {
        totalTransaksi,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
      data: transaksi,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message,
      error: error.message,
    });
  }
};

exports.pembayaranHutang = async (req, res) => {
  const { id_member, jumlah_bayar } = req.body;

  // Validasi input
  if (!id_member || jumlah_bayar <= 0) {
    return res
      .status(400)
      .json({ message: "ID member dan jumlah bayar harus valid" });
  }

  try {
    let message = "Pembayaran hutang berhasil!";

    await prisma.$transaction(async (prisma) => {
      const member = await prisma.memberKoperasi.findUnique({
        where: { id_member },
        include: {
          transaksi: {
            where: { status_transaksi: "belum_lunas" },
            orderBy: { created_at: "asc" },
          },
        },
      });

      if (!member) {
        return res.status(404).json({
          status: 404,
          message: "Anggota tidak ditemukan",
        });
      }

      if (member.transaksi.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "Anggota tidak memiliki sisa hutang",
        });
      }

      const totalSisaHutang = member.transaksi.reduce(
        (acc, t) => acc + t.sisa_hutang,
        0
      );

      if (jumlah_bayar > totalSisaHutang) {
        return res.status(400).json({
          status: 400,
          message: "Jumlah bayar tidak boleh melebihi sisa hutang",
        });
      }

      let sisaBayar = jumlah_bayar;
      let totalHutangTerbayar = 0;

      for (const transaksi of member.transaksi) {
        if (sisaBayar <= 0) break;

        const sisaHutang = transaksi.sisa_hutang;
        const pembayaran = Math.min(sisaBayar, sisaHutang);

        await prisma.pembayaranHutang.create({
          data: {
            id_member: member.id_member,
            id_transaksi: transaksi.id_transaksi,
            jumlah_bayar: pembayaran,
            sisa_hutang_setelah_bayar: sisaHutang - pembayaran,
          },
        });

        await prisma.transaksi.update({
          where: { id_transaksi: transaksi.id_transaksi },
          data: {
            sisa_hutang: sisaHutang - pembayaran,
            status_transaksi: sisaHutang - pembayaran === 0 ? "lunas" : "belum_lunas",
          },
        });

        sisaBayar -= pembayaran;
        totalHutangTerbayar += pembayaran;
      }

      await prisma.memberKoperasi.update({
        where: { id_member },
        data: {
          total_hutang: member.total_hutang - totalHutangTerbayar,
        },
      });

      res.status(200).json({ message });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message || "Terjadi kesalahan saat memproses pembayaran hutang",
    });
  }
};

exports.getTransaksiById = async (req, res) => {
  const { id } = req.params;

  try {
    const transaksi = await prisma.transaksi.findUnique({
      where: { id_transaksi: parseInt(id) },
      include: {
        detailTransaksi: true,
        user: true,
        member: true,
      },
    });

    if (!transaksi) {
      return res.status(404).json({
        status: 404,
        message: `Transaksi dengan ID ${id} tidak ditemukan.`,
      });
    }

    res.status(200).json({
      status: 200,
      message: "Transaksi berhasil ditemukan!",
      data: transaksi,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil data transaksi." });
  }
};

exports.updateTransaksi = async (req, res) => {
  const { id } = req.params;
  const {
    id_user,
    id_member,
    metode_bayar,
    total_transaksi,
    margin_cash,
    margin_kredit,
  } = req.body;

  try {
    const updatedTransaksi = await prisma.transaksi.update({
      where: { id_transaksi: parseInt(id) },
      data: {
        id_user,
        id_member,
        metode_bayar,
        total_transaksi,
        margin_cash,
        margin_kredit,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Transaksi berhasil diperbarui!",
      data: updatedTransaksi,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat memperbarui transaksi." });
  }
};

exports.deleteTransaksi = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.transaksi.delete({
      where: { id_transaksi: parseInt(id) },
    });

    res.status(204).json({
      status: 204,
      message: "Transaksi berhasil dihapus!",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat menghapus transaksi." });
  }
};
