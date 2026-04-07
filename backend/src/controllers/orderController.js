const Order = require('../models/Order');

exports.placeOrder = async (req, res, next) => {
  try {
    const { name, address, phone, items, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items explicitly provided' });
    }

    const order = new Order({
      name,
      address,
      phone,
      items,
      totalPrice
    });

    const createOrder = await order.save();
    res.status(201).json(createOrder);
  } catch (err) {
    next(err);
  }
};
