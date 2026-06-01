// ═══════════════════════════════════════════════════════════
//  ShopNav — Cart & Order API Client
//  Thin fetch wrappers for the backend REST API.
//  Assumes window.location.origin is the base URL.
// ═══════════════════════════════════════════════════════════

const API_BASE = window.location.origin;

// ── Cart API ────────────────────────────────────────────────

/**
 * Create or ensure a cart exists on the server.
 * @param {string} [cartId] — optional specific ID to use
 * @returns {Promise<{id, items, members}>}
 */
async function apiCreateCart(cartId) {
  const res = await fetch(`${API_BASE}/api/carts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartId })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to create cart');
  return data.cart;
}

/**
 * Fetch a cart by ID (items + members).
 * Auto-creates the cart if it doesn't exist.
 * @param {string} cartId
 */
async function apiGetCart(cartId) {
  const res = await fetch(`${API_BASE}/api/carts/${encodeURIComponent(cartId)}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to get cart');
  return data.cart;
}

/**
 * Replace the full items array for a cart.
 * @param {string} cartId
 * @param {Array} items
 */
async function apiUpdateCartItems(cartId, items) {
  const res = await fetch(`${API_BASE}/api/carts/${encodeURIComponent(cartId)}/items`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to update cart');
  return data.cart;
}

/**
 * Join a cart as a member (upserts).
 * @param {string} cartId
 * @param {{ name, emoji, lat, lng, locationName }} member
 */
async function apiJoinCart(cartId, member) {
  const res = await fetch(`${API_BASE}/api/carts/${encodeURIComponent(cartId)}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(member)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to join cart');
  return data.member;
}

// ── Orders API ──────────────────────────────────────────────

/**
 * Place an order.
 * @param {{ cartId, placedBy, items, total, paymentMethod, paymentDetails }} payload
 * @returns {Promise<Order>}
 */
async function apiPlaceOrder(payload) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to place order');
  return data.order;
}

/**
 * Get a single order by ID.
 * @param {string} orderId
 */
async function apiGetOrder(orderId) {
  const res = await fetch(`${API_BASE}/api/orders/${encodeURIComponent(orderId)}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Order not found');
  return data.order;
}

/**
 * List all orders (most recent first).
 */
async function apiListOrders() {
  const res = await fetch(`${API_BASE}/api/orders`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to list orders');
  return data.orders;
}
