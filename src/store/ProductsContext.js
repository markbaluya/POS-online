import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import { MENU } from "../data/menu";
import { registerProducts } from "../data/productRegistry";
import { getProducts, searchProducts, addProduct, deleteProduct } from "../data/productsApi";
import { isOnlineConfigured } from "../config";

const Ctx = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(MENU);
  const [loading, setLoading] = useState(false);
  const [online] = useState(isOnlineConfigured());
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isOnlineConfigured()) {
      setProducts(MENU);
      registerProducts(MENU);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await getProducts(); // GET
      setProducts(list);
      registerProducts(list);
    } catch (e) {
      setError(String(e.message));
      setProducts(MENU); // fallback so UI still runs
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const search = useCallback(async (q) => {
    const needle = (q || "").trim();
    if (!needle) return refresh();
    if (!isOnlineConfigured()) {
      const n = needle.toLowerCase();
      setProducts(MENU.filter((m) => m.name.toLowerCase().includes(n)));
      return;
    }
    setLoading(true);
    try {
      const list = await searchProducts(needle); // GET search
      setProducts(list);
      registerProducts(list);
    } catch (e) {
      setError(String(e.message));
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const create = useCallback(async (p) => {
    const row = await addProduct(p); // POST
    await refresh();
    return row;
  }, [refresh]);

  const remove = useCallback(async (id) => {
    await deleteProduct(id); // DELETE
    await refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ products, loading, online, error, refresh, search, create, remove }),
    [products, loading, online, error, refresh, search, create, remove]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useProducts = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProducts must be used inside ProductsProvider");
  return ctx;
};
