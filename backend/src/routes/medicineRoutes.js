const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

router.post('/add', medicineController.addMedicine);
router.get('/search', medicineController.searchMedicines);
router.get('/category/:category', medicineController.getByCategory);
router.get('/:id', medicineController.getMedicineById);
router.get('/:id/alternatives', medicineController.getAlternatives);

module.exports = router;