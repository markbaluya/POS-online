// Online database layer (Supabase Postgres REST).
// Instructor entry point: all 4 required operations are here.
//
//   GET    getProducts()      -> display products
//   GET    searchProducts(q)  -> search products
//   POST   addProduct(p)      -> add product
//   DELETE deleteProduct(id) -> delete product
//
// App flow: YOUR POS -> fetch() -> Supabase REST -> Postgres table `products`.
// No PHP/MySQL server to host. Works in Expo Go (no native modules).

import { SUPABASE_URL, SUPABASE_ANON_KEY, isOnlineConfigured } from "../config";

function ensureConfigured() {
  if (!isOnlineConfigured()) {
    throw new Error("Supabase not configured. See ONLINE_SETUP.md / supabase.sql");
  }
}

function baseHeaders() {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };
}

function toAppRow(row) {
  // Supabase row -> app product shape (same as MENU items)
  return {
    id: String(row.id),
    name: row.name,
    category: row.category,
    price: Number(row.price),
    rating: String(row.rating ?? "4.5"),
    image_url: row.image_url ?? null,
    image: null, // resolved by ProductCard (remote URL or placeholder)
  };
}

// GET -> display products
export async function getProducts() {
  ensureConfigured();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=name`, {
    headers: baseHeaders(),
  });
  if (!res.ok) throw new Error(`GET products failed: ${res.status}`);
  const rows = await res.json();
  return rows.map(toAppRow);
}

// GET -> search products (server-side, not local filter)
export async function searchProducts(q) {
  ensureConfigured();
  const needle = encodeURIComponent(q);
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=*&name=ilike.*${needle}*&order=name`,
    { headers: baseHeaders() }
  );
  if (!res.ok) throw new Error(`SEARCH failed: ${res.status}`);
  const rows = await res.json();
  return rows.map(toAppRow);
}

// POST -> add product
export async function addProduct({ name, category, price, rating }) {
  ensureConfigured();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
    method: "POST",
    headers: { ...baseHeaders(), Prefer: "return=representation" },
    body: JSON.stringify({ name, category, price, rating: rating ?? "4.5" }),
  });
  if (!res.ok) throw new Error(`POST failed: ${res.status}`);
  const rows = await res.json();
  return rows.map(toAppRow)[0];
}

// DELETE -> delete product
export async function deleteProduct(id) {
  ensureConfigured();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: baseHeaders(),
  });
  if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);
}
