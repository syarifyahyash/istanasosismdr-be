const express = require('express');
const router = express.Router();
const produkController = require('../controllers/produkController');

// Rute untuk CRUD Produk
router.post('/', produkController.createProduk);
router.get('/', produkController.getAllProduk);
router.get('/:id', produkController.getProdukById);
router.put('/:id', produkController.updateProduk);
router.put('/stok/:id', produkController.updateStokProduk);
router.delete('/:id', produkController.deleteProduk);

module.exports = router;
