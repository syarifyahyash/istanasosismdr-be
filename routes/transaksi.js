const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');

router.post('/', transaksiController.createTransaksi);
router.get('/', transaksiController.getAllTransaksi);
router.post('/pembayaran-hutang', transaksiController.pembayaranHutang);
router.get('/:id', transaksiController.getTransaksiById);
router.put('/:id', transaksiController.updateTransaksi);
router.delete('/:id', transaksiController.deleteTransaksi);

module.exports = router;
