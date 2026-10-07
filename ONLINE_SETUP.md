# POS goes online (Supabase)

Your UI is unchanged. Only the data layer changed.

## What instructor checks
- `src/data/productsApi.js` — GET getProducts, GET searchProducts, POST addProduct, DELETE deleteProduct
- `src/screens/InventoryScreen.js` — visible Add / Search / Delete UI
- `src/store/ProductsContext.js` — provider with offline fallback to MENU
- `src/config.js` — Supabase URL + anon key

Flow: POS -> fetch() -> Supabase REST -> Postgres `products` table.

## Setup (10 min, free)
1. supabase.com -> New project (free).
2. SQL Editor -> paste `supabase.sql` -> Run.
3. Project Settings -> API -> copy URL + anon key into `src/config.js`.
4. `npx expo start` -> open Menu (GET) + Inventory tab:
   - search box = online SEARCH
   - Add form = online POST
   - Delete button = online DELETE

Without keys, app still runs using local `src/data/menu.js`.

## Note on AGENTS.md
AGENTS.md says use Expo Router in `src/app/`. This project uses React Navigation bottom-tabs.
Migration was skipped to avoid breaking your existing navigation. New Inventory screen was added to the existing Tab navigator instead.
No new native modules were added, so Expo Go still works.
