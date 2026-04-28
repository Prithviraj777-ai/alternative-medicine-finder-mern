const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// ─── All admin routes require authentication + admin role ───────
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.get('/stats', adminController.getStats);

// User management
router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);

// Medicine management
router.get('/medicines', adminController.getMedicines);
router.post('/medicines', adminController.addMedicine);
router.put('/medicines/:id', adminController.updateMedicine);
router.delete('/medicines/:id', adminController.deleteMedicine);

// Order management
router.get('/orders', adminController.getOrders);
router.delete('/orders/:id', adminController.deleteOrder);

module.exports = router;
