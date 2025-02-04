const express = require('express');

const router = require('express').Router();
const userRoutes = require('./user');
const kategoriRoutes = require('./kategori');
const produkRoutes = require('./produk');
const memberRoutes = require('./memberkoperasi');
const metodeBayarRoutes = require('./metodebayar');
const transaksi = require('./transaksi');
const detailTransaksi = require('./detailTransaksi');
const stock = require('./stock');
const summary = require('./summary');
const pembayaranHutang = require('./pembayaranHutang');

const { loginUser }= require('../controllers/userController');
router.post('/login', loginUser);
router.use('/summary', summary);

router.use('/users', userRoutes);
router.use('/kategori', kategoriRoutes);
router.use('/produk', produkRoutes);
router.use('/member', memberRoutes);
router.use('/metode-bayar', metodeBayarRoutes);
router.use('/transaksi', transaksi);
router.use('/transaksi/detail', detailTransaksi);
router.use('/stocklog', stock);
router.use('/pembayaran-hutang', pembayaranHutang);

module.exports = router;