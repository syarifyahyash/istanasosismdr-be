const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mendapatkan semua metode bayar
const getAllMetodeBayar = async (req, res) => {
  try {
    const metodeBayar = await prisma.metodeBayar.findMany();
    res.status(200).json({ status: 200, message: 'Metode bayar berhasil ditampilkan!', data: metodeBayar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil metode bayar' });
  }
};

// Menambahkan metode bayar baru
const createMetodeBayar = async (req, res) => {
  const { jenis_metode } = req.body;

  try {
    const newMetodeBayar = await prisma.metodeBayar.create({
      data: {
        jenis_metode,
      },
    });

    res.status(201).json(newMetodeBayar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan metode bayar' });
  }
};

module.exports = {
  getAllMetodeBayar,
  createMetodeBayar,
};
