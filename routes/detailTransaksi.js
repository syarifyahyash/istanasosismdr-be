const express = require('express');
const router = express.Router();
const detailTransaksiController = require('../controllers/detailTransaksiController');

router.post('/', detailTransaksiController.createDetailTransaksi);
router.get('/all', detailTransaksiController.getAllDetailTransaksi);
router.get('/:id', detailTransaksiController.getDetailTransaksiById);
router.put('/:id', detailTransaksiController.updateDetailTransaksi);
router.delete('/:id', detailTransaksiController.deleteDetailTransaksi);

module.exports = router;
