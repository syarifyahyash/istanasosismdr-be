const express = require('express');
const router = express.Router();
const metodeBayarController = require('../controllers/metodebayarController');

// Route untuk mendapatkan semua metode bayar
router.get('/', metodeBayarController.getAllMetodeBayar);

// Route untuk menambahkan metode bayar
router.post('/', metodeBayarController.createMetodeBayar);

module.exports = router;
