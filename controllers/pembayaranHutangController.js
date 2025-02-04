const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mengambil semua data PembayaranHutang
exports.getAllPembayaranHutang = async (req, res) => {
    try {
        const pembayaranHutang = await prisma.pembayaranHutang.findMany({
            orderBy: {
                id_pembayaran: 'desc'
            },
            include: {
                member: {
                    select: {
                        nama: true,
                        npk: true
                    }
                },
            }
        });

        res.status(200).json({
            status: 200,
            message: 'Data pembayaran hutang berhasil ditampilkan!',
            data: pembayaranHutang
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            status: 500,
            message: 'Terjadi kesalahan saat mengambil data pembayaran hutang.',
        });
    }
};
