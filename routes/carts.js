// ═══════════════════════════════════════════════════════════
//  ShopNav — Cart REST Routes
//  POST   /api/carts              — create cart
//  GET    /api/carts/:id          — get cart + members
//  PUT    /api/carts/:id/items    — update items array
//  POST   /api/carts/:id/members  — join cart (upsert member)
// ═══════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const db = require('../db/database');

// POST /api/carts — Create a new cart (or ensure one exists)
router.post('/', (req, res) => {
  try {
    const { cartId } = req.body;
    const cart = db.createCart(cartId || undefined);
    res.json({ success: true, cart });
  } catch (err) {
    console.error('POST /api/carts error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/carts/:id — Fetch cart with members
router.get('/:id', (req, res) => {
  try {
    const cart = db.getCart(req.params.id);
    if (!cart) {
      // Auto-create the cart if it doesn't exist yet
      const newCart = db.createCart(req.params.id);
      return res.json({ success: true, cart: newCart });
    }
    res.json({ success: true, cart });
  } catch (err) {
    console.error('GET /api/carts/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/carts/:id/items — Replace items array
router.put('/:id/items', (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'items must be an array' });
    }
    // Ensure cart exists
    db.createCart(req.params.id);
    const cart = db.updateCartItems(req.params.id, items);
    res.json({ success: true, cart });
  } catch (err) {
    console.error('PUT /api/carts/:id/items error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/carts/:id/members — Join a cart
router.post('/:id/members', (req, res) => {
  try {
    const member = req.body;
    if (!member || !member.name) {
      return res.status(400).json({ error: 'member.name is required' });
    }
    // Ensure cart exists
    db.createCart(req.params.id);
    const saved = db.upsertCartMember(req.params.id, member);
    res.json({ success: true, member: saved });
  } catch (err) {
    console.error('POST /api/carts/:id/members error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
