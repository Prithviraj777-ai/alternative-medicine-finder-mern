const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Order = require('../models/Order');

// ─── Get dashboard statistics ───────────────────────────────────
// GET /api/admin/stats  (Admin only)
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMedicines = await Medicine.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalMedicines,
        totalOrders,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Get all users ──────────────────────────────────────────────
// GET /api/admin/users  (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Delete a user ──────────────────────────────────────────────
// DELETE /api/admin/users/:id  (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account from admin panel',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Get all medicines (admin view with pagination) ─────────────
// GET /api/admin/medicines  (Admin only)
exports.getMedicines = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    // Build query — optional search filter
    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const medicines = await Medicine.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Medicine.countDocuments(query);

    res.json({
      success: true,
      medicines,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get medicines error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Add a medicine ─────────────────────────────────────────────
// POST /api/admin/medicines  (Admin only)
exports.addMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json({ success: true, medicine });
  } catch (error) {
    console.error('Add medicine error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Update a medicine ──────────────────────────────────────────
// PUT /api/admin/medicines/:id  (Admin only)
exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
    }

    res.json({ success: true, medicine });
  } catch (error) {
    console.error('Update medicine error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Delete a medicine ──────────────────────────────────────────
// DELETE /api/admin/medicines/:id  (Admin only)
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
    }

    res.json({ success: true, message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('Delete medicine error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Get all orders ─────────────────────────────────────────────
// GET /api/admin/orders  (Admin only)
exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments();

    res.json({
      success: true,
      orders,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get orders error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Delete an order ────────────────────────────────────────────
// DELETE /api/admin/orders/:id  (Admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
