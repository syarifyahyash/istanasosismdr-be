const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk membuat anggota koperasi baru
exports.createMember = async (req, res) => {
  const { npk, nama, jabatan } = req.body;

  try {
    // Buat anggota koperasi baru
    const newMember = await prisma.memberKoperasi.create({
      data: {
        npk,
        nama,
        jabatan
      },
    });

    res.status(201).json({
      status: 201,
      message: 'Anggota koperasi berhasil ditambahkan!',
      data: newMember,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan saat menambahkan anggota koperasi.',
    });
  }
};

// Fungsi untuk mendapatkan semua anggota koperasi
exports.getAllMembers = async (req, res) => {
  // const { page = 1, limit = 10 } = req.query;
  // const offset = (page - 1) * limit;
  try {
    const members = await prisma.memberKoperasi.findMany({
      // skip: parseInt(offset),
      // take: parseInt(limit),
      orderBy: {
        id_member: 'desc',
      },
    });

    // Hitung total data
    const totalData = await prisma.memberKoperasi.count();

    // Hitung total halaman
    // const totalPages = Math.ceil(totalData / limit);

    res.status(200).json({
      status: 200,
      message: 'Anggota koperasi berhasil ditampilkan!',
      // meta: {
      //   totalPages,
      //   currentPage: parseInt(page),
      //   pageSize: parseInt(limit),
      // },
      data: members,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan saat mengambil data anggota koperasi.',
    });
  }
};

// Fungsi untuk mendapatkan semua anggota koperasi dengan sorting asc total_hutang
exports.getAllMembersByTotalHutang = async (req, res) => {
  try {
    const members = await prisma.memberKoperasi.findMany({
      orderBy: {
        total_hutang: 'desc',
      },
    });

    res.status(200).json({
      status: 200,
      message: 'Anggota koperasi berhasil ditampilkan!',
      data: members,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan saat mengambil data anggota koperasi.',
    });
  }
};

// Fungsi untuk mendapatkan anggota koperasi berdasarkan ID (npk/PHT)
exports.getMemberById = async (req, res) => {
  const { id } = req.params;

  try {
    const member = await prisma.memberKoperasi.findUnique({
      where: { id_member: parseInt(id) },
    });

    if (!member) {
      return res.status(404).json({
        status: 404,
        message: `Anggota koperasi dengan ID ${id} tidak ditemukan.`,
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Anggota koperasi berhasil ditemukan!',
      data: member,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan saat mengambil data anggota koperasi.',
    });
  }
};

// Fungsi untuk memperbarui anggota koperasi
exports.updateMember = async (req, res) => {
  const { id } = req.params;
  const { npk, nama, jabatan } = req.body;

  try {
    const updatedMember = await prisma.memberKoperasi.update({
      where: { id_member: parseInt(id) },
      data: {
        npk,
        nama,
        jabatan,
      },
    });

    res.status(200).json({
      status: 200,
      message: 'Anggota koperasi berhasil diperbarui!',
      data: updatedMember,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan saat memperbarui data anggota koperasi.',
    });
  }
};

// Fungsi untuk menghapus anggota koperasi
exports.deleteMember = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.memberKoperasi.delete({
      where: { id_member: parseInt(id) },
    });

    res.status(200).json({
      status: 200,
      message: `Anggota koperasi dengan ID ${id} berhasil dihapus.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan saat menghapus data anggota koperasi.',
    });
  }
};
