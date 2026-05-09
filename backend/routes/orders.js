const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

// Create new order
router.post('/', protect, async (req, res) => {
  try {
    const { products, shippingAddress, totalAmount } = req.body;

    if (products && products.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      const order = new Order({
        user: req.user._id,
        products,
        shippingAddress,
        totalAmount
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get logged in user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('products.product', 'name image price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('products.product', 'name image price');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all orders (Admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update order status (Admin)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
