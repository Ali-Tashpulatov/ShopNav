// ═══════════════════════════════════════════════════════════
//  ShopNav — Orders REST Routes
//  POST  /api/orders       — place an order
//  GET   /api/orders       — list all orders
//  GET   /api/orders/:id   — single order detail
// ═══════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const db = require('../db/database');

// POST /api/orders — Place a new order
router.post('/', (req, res) => {
  try {
    const { cartId, placedBy, items, total, paymentMethod, paymentDetails } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'items array is required' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ error: 'paymentMethod is required' });
    }
    const order = db.createOrder({ cartId, placedBy, items, total, paymentMethod, paymentDetails });
    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders — List all orders
router.get('/', (req, res) => {
  try {
    const orders = db.listOrders();
    res.json({ success: true, orders });
  } catch (err) {
    console.error('GET /api/orders error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id — Single order
router.get('/:id', (req, res) => {
  try {
    const order = db.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (err) {
    console.error('GET /api/orders/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
