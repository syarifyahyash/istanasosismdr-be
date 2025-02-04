const express = require('express');
const router = express.Router();
const memberkoperasiController = require('../controllers/memberkoperasiController');

router.post('/', memberkoperasiController.createMember);
router.get('/', memberkoperasiController.getAllMembers);
router.get('/kredit', memberkoperasiController.getAllMembersByTotalHutang);
router.get('/:id', memberkoperasiController.getMemberById);
router.put('/:id', memberkoperasiController.updateMember);
router.delete('/:id', memberkoperasiController.deleteMember);

module.exports = router;
