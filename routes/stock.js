const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.post('/', stockController.createStockLog);
router.get('/', stockController.getAllStockLog);
router.get('/:id', stockController.getStockLogById);
router.put('/:id', stockController.updateStockLog);
router.delete('/:id', stockController.deleteStockLog);

module.exports = router;