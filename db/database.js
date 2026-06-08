// ═══════════════════════════════════════════════════════════
//  ShopNav — SQLite Database Layer
//  Uses better-sqlite3 (synchronous) for simplicity.
// ═══════════════════════════════════════════════════════════

const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// DB_PATH env var lets you point to a persistent disk on Render (/var/data/shopnav.db).
// Falls back to the project root when running locally.
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'shopnav.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ─────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS carts (
    id          TEXT PRIMARY KEY,
    items       TEXT NOT NULL DEFAULT '[]',
    created_at  DATETIME DEFAULT (datetime('now')),
    updated_at  DATETIME DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS cart_members (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_id       TEXT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    name          TEXT NOT NULL,
    emoji         TEXT DEFAULT '👤',
    lat           REAL DEFAULT 43.238,
    lng           REAL DEFAULT 76.945,
    location_name TEXT DEFAULT 'Unknown',
    joined_at     DATETIME DEFAULT (datetime('now')),
    UNIQUE(cart_id, name)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id              TEXT PRIMARY KEY,
    cart_id         TEXT,
    placed_by       TEXT NOT NULL,
    items           TEXT NOT NULL DEFAULT '[]',
    total           REAL NOT NULL DEFAULT 0,
    payment_method  TEXT NOT NULL DEFAULT 'cash',
    payment_details TEXT NOT NULL DEFAULT '{}',
    status          TEXT NOT NULL DEFAULT 'confirmed',
    created_at      DATETIME DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS categories (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    emoji       TEXT,
    image       TEXT
  );

  CREATE TABLE IF NOT EXISTS supermarkets (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    lat         REAL,
    lng         REAL,
    address     TEXT,
    city        TEXT,
    hours       TEXT
  );

  CREATE TABLE IF NOT EXISTS ingredients (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    brand       TEXT,
    category_id TEXT REFERENCES categories(id),
    weight      TEXT,
    unit_type   TEXT,
    image       TEXT,
    tags        TEXT
  );

  CREATE TABLE IF NOT EXISTS inventory (
    ingredient_id TEXT REFERENCES ingredients(id) ON DELETE CASCADE,
    store_id      TEXT REFERENCES supermarkets(id) ON DELETE CASCADE,
    price         REAL NOT NULL,
    stock_status  TEXT NOT NULL DEFAULT 'in',
    PRIMARY KEY(ingredient_id, store_id)
  );

  CREATE TABLE IF NOT EXISTS recipes (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    emoji       TEXT,
    category    TEXT,
    servings    TEXT
  );

  CREATE TABLE IF NOT EXISTS recipe_ingredients (
    recipe_id     TEXT REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id TEXT REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity      TEXT,
    PRIMARY KEY(recipe_id, ingredient_id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    name        TEXT,
    email       TEXT UNIQUE,
    password_hash TEXT,
    created_at  DATETIME DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS product_likes (
    product_id  TEXT PRIMARY KEY,
    likes_count INTEGER NOT NULL DEFAULT 0
  );
`);

// ── Cart Queries ────────────────────────────────────────────

/**
 * Create a new cart with a given ID (or auto-generate one).
 */
function createCart(cartId) {
  const id = cartId || generateCartId();
  const stmt = db.prepare(
    `INSERT OR IGNORE INTO carts (id, items) VALUES (?, '[]')`
  );
  stmt.run(id);
  return getCart(id);
}

/**
 * Get a cart by ID, including its members.
 */
function getCart(cartId) {
  const cart = db.prepare(`SELECT * FROM carts WHERE id = ?`).get(cartId);
  if (!cart) return null;
  const members = db.prepare(
    `SELECT * FROM cart_members WHERE cart_id = ? ORDER BY joined_at ASC`
  ).all(cartId);
  return {
    ...cart,
    items: JSON.parse(cart.items || '[]'),
    members
  };
}

/**
 * Replace the full items array for a cart.
 */
function updateCartItems(cartId, items) {
  const stmt = db.prepare(
    `UPDATE carts SET items = ?, updated_at = datetime('now') WHERE id = ?`
  );
  stmt.run(JSON.stringify(items), cartId);
  return getCart(cartId);
}

/**
 * Upsert a member into a cart. Returns the upserted member row.
 */
function upsertCartMember(cartId, member) {
  const stmt = db.prepare(`
    INSERT INTO cart_members (cart_id, name, emoji, lat, lng, location_name)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(cart_id, name) DO UPDATE SET
      emoji = excluded.emoji,
      lat   = excluded.lat,
      lng   = excluded.lng,
      location_name = excluded.location_name
  `);
  stmt.run(
    cartId,
    member.name,
    member.emoji || '👤',
    member.lat || 43.238,
    member.lng || 76.945,
    member.locationName || 'Unknown'
  );
  return db.prepare(
    `SELECT * FROM cart_members WHERE cart_id = ? AND name = ?`
  ).get(cartId, member.name);
}

// ── Order Queries ───────────────────────────────────────────

/**
 * Place an order and persist to DB.
 */
function createOrder(data) {
  const id = uuidv4();
  const stmt = db.prepare(`
    INSERT INTO orders (id, cart_id, placed_by, items, total, payment_method, payment_details, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')
  `);
  stmt.run(
    id,
    data.cartId || null,
    data.placedBy || 'Guest',
    JSON.stringify(data.items || []),
    data.total || 0,
    data.paymentMethod || 'cash',
    JSON.stringify(data.paymentDetails || {})
  );
  return getOrder(id);
}

/**
 * Get a single order by ID.
 */
function getOrder(orderId) {
  const row = db.prepare(`SELECT * FROM orders WHERE id = ?`).get(orderId);
  if (!row) return null;
  return {
    ...row,
    items: JSON.parse(row.items || '[]'),
    paymentDetails: JSON.parse(row.payment_details || '{}')
  };
}

/**
 * List all orders, most recent first.
 */
function listOrders() {
  const rows = db.prepare(
    `SELECT * FROM orders ORDER BY created_at DESC`
  ).all();
  return rows.map(row => ({
    ...row,
    items: JSON.parse(row.items || '[]'),
    paymentDetails: JSON.parse(row.payment_details || '{}')
  }));
}

// ── Helpers ─────────────────────────────────────────────────

function generateCartId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SC-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ── Likes Queries ───────────────────────────────────────────

/**
 * Get all product likes mapping { [productId]: count }
 */
function getAllProductLikes() {
  const rows = db.prepare(`SELECT product_id, likes_count FROM product_likes`).all();
  const result = {};
  for (const row of rows) {
    result[row.product_id] = row.likes_count;
  }
  return result;
}

/**
 * Increment like for a product
 */
function incrementProductLike(productId) {
  const stmt = db.prepare(`
    INSERT INTO product_likes (product_id, likes_count)
    VALUES (?, 1)
    ON CONFLICT(product_id) DO UPDATE SET likes_count = likes_count + 1
  `);
  stmt.run(productId);
  const row = db.prepare(`SELECT likes_count FROM product_likes WHERE product_id = ?`).get(productId);
  return row ? row.likes_count : 0;
}

/**
 * Decrement like for a product
 */
function decrementProductLike(productId) {
  const stmt = db.prepare(`
    UPDATE product_likes
    SET likes_count = MAX(0, likes_count - 1)
    WHERE product_id = ?
  `);
  stmt.run(productId);
  const row = db.prepare(`SELECT likes_count FROM product_likes WHERE product_id = ?`).get(productId);
  return row ? row.likes_count : 0;
}

module.exports = {
  db,
  createCart,
  getCart,
  updateCartItems,
  upsertCartMember,
  createOrder,
  getOrder,
  listOrders,
  generateCartId,
  getAllProductLikes,
  incrementProductLike,
  decrementProductLike
};
