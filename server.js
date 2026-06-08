// ═══════════════════════════════════════════════════════════
//  ShopNav — Express + Socket.IO Server
// ═══════════════════════════════════════════════════════════

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const cartRoutes = require('./routes/carts');
const orderRoutes = require('./routes/orders');
const likesRoutes = require('./routes/likes');
const dbModule = require('./db/database');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT'] }
});

const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve the entire Capstone directory as static files
// This means cart.html, index.html, etc. are all accessible at /
app.use(express.static(path.join(__dirname)));

// ── Health Check (used by Render / load balancers) ─────────
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── REST API Routes ─────────────────────────────────────────
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/likes', likesRoutes);

// Convenience redirect: /cart/:cartId → cart.html?cartId=...
app.get('/cart/:cartId', (req, res) => {
  res.redirect(`/cart.html?cartId=${req.params.cartId}`);
});

// ── Socket.IO Real-Time Logic ───────────────────────────────
io.on('connection', (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  // ── join-cart ──────────────────────────────────────────
  // Client sends: { cartId, member: { name, emoji, lat, lng, locationName } }
  // Server: persists member, broadcasts member-joined to the room,
  //         sends full cart state back to the joining socket.
  socket.on('join-cart', async ({ cartId, member }) => {
    if (!cartId || !member) return;

    try {
      // Ensure cart exists in DB
      dbModule.createCart(cartId);

      // Upsert member
      dbModule.upsertCartMember(cartId, member);

      // Join the Socket.IO room for this cart
      socket.join(cartId);
      socket.data.cartId = cartId;
      socket.data.memberName = member.name;

      // Broadcast to others in the room
      socket.to(cartId).emit('member-joined', { member });

      // Send current cart state (items + members) back to the new joiner
      const cart = dbModule.getCart(cartId);
      socket.emit('cart-synced', { cart });

      console.log(`[Socket] ${member.name} joined cart ${cartId}`);
    } catch (err) {
      console.error('[Socket] join-cart error:', err);
    }
  });

  // ── cart-updated ───────────────────────────────────────
  // Client sends: { cartId, items, updatedBy }
  // Server: persists items, broadcasts to all other members in room.
  socket.on('cart-updated', ({ cartId, items, updatedBy }) => {
    if (!cartId || !Array.isArray(items)) return;

    try {
      dbModule.createCart(cartId);
      dbModule.updateCartItems(cartId, items);

      // Broadcast to everyone else in the room
      socket.to(cartId).emit('cart-updated', { items, updatedBy });

      console.log(`[Socket] Cart ${cartId} updated by ${updatedBy} (${items.length} items)`);
    } catch (err) {
      console.error('[Socket] cart-updated error:', err);
    }
  });

  // ── member-updated ─────────────────────────────────────
  // Client sends: { cartId, member, oldName? }
  // Server: persists, broadcasts to room.
  socket.on('member-updated', ({ cartId, member, oldName }) => {
    if (!cartId || !member) return;

    try {
      dbModule.upsertCartMember(cartId, member);
      socket.to(cartId).emit('member-updated', { member, oldName });
    } catch (err) {
      console.error('[Socket] member-updated error:', err);
    }
  });

  // ── optimize-updated ───────────────────────────────────
  // Client sends: { cartId, cart, isOptimized, members }
  // Server: persists cart, broadcasts to room.
  socket.on('optimize-updated', ({ cartId, cart, isOptimized, members }) => {
    if (!cartId) return;

    try {
      if (Array.isArray(cart)) {
        dbModule.updateCartItems(cartId, cart);
      }
      socket.to(cartId).emit('optimize-updated', { cart, isOptimized, members });
    } catch (err) {
      console.error('[Socket] optimize-updated error:', err);
    }
  });

  // ── checkout-complete ──────────────────────────────────
  // Client sends: { cartId, orderId, placedBy }
  // Server: notifies all members in the room.
  socket.on('checkout-complete', ({ cartId, orderId, placedBy }) => {
    if (!cartId) return;
    io.to(cartId).emit('checkout-complete', { orderId, placedBy });
    console.log(`[Socket] Checkout complete in cart ${cartId} by ${placedBy}`);
  });

  // ── disconnect ─────────────────────────────────────────
  socket.on('disconnect', () => {
    const { cartId, memberName } = socket.data;
    if (cartId && memberName) {
      socket.to(cartId).emit('member-left', { name: memberName });
    }
    console.log(`[Socket] Disconnected: ${socket.id} (${memberName || 'unknown'})`);
  });
});

// ── Start Server ────────────────────────────────────────────
server.listen(PORT, () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const url = isProduction
    ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'your-app.onrender.com'}`
    : `http://localhost:${PORT}`;

  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║   ShopNav Server is running! 🛒      ║');
  console.log(`  ║   ${url.padEnd(38)}║`);
  console.log('  ║   Open cart.html to get started      ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
});
