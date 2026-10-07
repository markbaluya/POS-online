// Merges static MENU items with online products so Cart keeps working
// for both local ids (latte, ramen...) and Supabase ids.
import { MENU } from "./menu";

let extra = {}; // {id: product}

export function registerProducts(list) {
  extra = {};
  for (const p of list || []) extra[String(p.id)] = p;
}

export function resolveProduct(id) {
  const key = String(id);
  const local = MENU.find((m) => String(m.id) === key);
  if (local) return local;
  return extra[key] ?? null;
}
