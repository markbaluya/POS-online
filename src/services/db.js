// Lab 05 database service (CLO 2.1, 2.2).
// Embedded SQLite via modern expo-sqlite sync API. No server, no internet.
import * as SQLite from "expo-sqlite";

let _db = null;

// Lazy open: importing this module never throws (web without COOP/COOP
// headers has no SharedArrayBuffer, so open is deferred to first use
// where callers can catch and show a fallback).
export function getDb() {
  if (!_db) _db = SQLite.openDatabaseSync("pos_inventory.db");
  return _db;
}

export function initDatabase() {
  const db = getDb();
  // WAL mode for speed (DDL: PRAGMA)
  db.execSync(`PRAGMA journal_mode = WAL;`);

  // DDL: relational schema with autoincrement PK + NOT NULL integrity
  db.execSync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL
    );
  `);

  // Auto-seed on first launch so the screen is never blank (CLO 2.3)
  const countRow = db.getFirstSync("SELECT COUNT(*) as count FROM products;");
  if (countRow.count === 0) {
    db.runSync(
      "INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?);",
      [
        "Coffee Latte", "Coffee", 4.5, 48,
        "Ramen Bowl", "Noodle", 14.5, 25,
        "Thanos Burger", "Burger", 9.9, 14,
        "Boba Milk Tea", "Tea", 6.2, 30,
        "Pepperoni", "Pizza", 13.5, 12,
      ]
    );
  }
}

// READ all (CLO 2.4)
export function getAllProducts() {
  return getDb().getAllSync("SELECT * FROM products ORDER BY id DESC;");
}

// SEARCH with parameterized LIKE (CLO 2.4, 2.5) — no string concat, no injection
export function searchProductsByName(search) {
  return getDb().getAllSync("SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC;", [
    `%${search}%`,
  ]);
}

// CREATE (CLO 2.4)
export function insertProduct(name, category, price, stock) {
  return getDb().runSync(
    "INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?);",
    [name, category, price, stock]
  );
}

// DELETE (CLO 2.4)
export function deleteProductById(id) {
  return getDb().runSync("DELETE FROM products WHERE id = ?;", [id]);
}

// BONUS: stock +/- (UPDATE)
export function changeStock(id, delta) {
  return getDb().runSync("UPDATE products SET stock = stock + ? WHERE id = ?;", [delta, id]);
}
