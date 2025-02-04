const express = require('express');
const router = express.Router();
const pembayaranHutangController = require('../controllers/pembayaranHutangController');

// Endpoint untuk mendapatkan semua data pembayaran hutang
router.get('/', pembayaranHutangController.getAllPembayaranHutang);

module.exports = router;
