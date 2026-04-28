const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Order = require('../models/Order');

// @route POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { medicines } = req.body;

    if (!medicines || medicines.length === 0) {
      return res.status(400).json({ success: false, message: 'No medicines provided' });
    }

    // Calculate total amount securely on backend
    let totalAmount = 0;
    medicines.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    const options = {
      amount: totalAmount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      totalAmount
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route POST /api/payment/verify-payment
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      medicines,
      name,
      address,
      phone,
      userId
    } = req.body;

    // Calculate total amount for saving to MongoDB
    let totalAmount = 0;
    medicines.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    // Create HMAC SHA256 signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      // Signature verification failed
      const failedOrder = new Order({
        userId,
        medicines,
        totalAmount,
        name,
        address,
        phone,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        paymentStatus: 'FAILED'
      });
      await failedOrder.save();

      return res.status(400).json({ success: false, message: 'Transaction not legit!' });
    }

    // Signature verification successful
    const newOrder = new Order({
      userId,
      medicines,
      totalAmount,
      name,
      address,
      phone,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentStatus: 'SUCCESS'
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
