const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt'); // Import bcrypt
const { generateToken, decodeToken } = require('../helpers/token');
const prisma = new PrismaClient();

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Hash password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 adalah salt rounds

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Simpan password yang sudah di-hash
        role,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error); // Debug jika ada kesalahan
    res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan pengguna.' });
  }
};

// Fungsi untuk mendapatkan semua pengguna
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({
      status: 200,
      message: 'Pengguna ditampilkan!',
      data: users
    });
  } catch (error) {
    console.error(error); // Debug jika ada kesalahan
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pengguna.' });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params; // Ambil id dari parameter URL

  try {
    const user = await prisma.user.findUnique({
      where: { id_user: parseInt(id) }, // Pastikan id di-cast ke integer
    });

    if (user) {
      res.json({
        status: 200,
        message: 'Pengguna ditemukan!',
        data: user,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: 'Pengguna tidak ditemukan.',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pengguna.' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    // Jika password disertakan dalam request body, hash ulang
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id_user: parseInt(id) },
      data: {
        name,
        email,
        role,
        ...(password && { password: hashedPassword }), // Hanya update password jika disertakan
      },
    });

    res.json({
      status: 200,
      message: 'Pengguna berhasil diperbarui!',
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui pengguna.' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await prisma.user.delete({
      where: { id_user: parseInt(id) },
    });

    res.json({
      status: 200,
      message: 'Pengguna berhasil dihapus!',
      data: deletedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus pengguna.' });
  }
};

function validateBodyRequest (body, res) {
  if (body.email == '' || body.email == undefined || body.email == null) {
    return res.status(400).json({
      status: false,
      message: 'Email tidak boleh kosong'
    });
  }

  if (body.password == '' || body.password == undefined || body.password == null) {
    return res.status(400).json({
      status: false,
      message: 'Password tidak boleh kosong'
    });
  }
}

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: 'Email or password is incorrect',
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        message: 'Email or password is incorrect',
      });
    }

    // Generate token with user data
    const token = generateToken({
      id: user.id_user,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return res.json({
      status: 200,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Server error',
    });
  }
};