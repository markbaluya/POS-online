import React, { createContext, useContext, useMemo, useState } from 'react';
import { resolveProduct } from '../data/productRegistry';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [lines, setLines] = useState({}); // {id: qty}
  const [payMethod, setPayMethod] = useState('Cash');

  const add = (id) =>
    setLines((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const inc = add;
  const dec = (id) =>
    setLines((p) => {
      const q = (p[id] || 0) - 1;
      const next = { ...p };
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  const remove = (id) =>
    setLines((p) => {
      const next = { ...p };
      delete next[id];
      return next;
    });
  const clear = () => setLines({});

  const value = useMemo(() => {
    const entries = Object.entries(lines)
      .map(([id, qty]) => ({ item: resolveProduct(id), qty }))
      .filter((e) => e.item && e.qty > 0);
    const count = entries.reduce((n, e) => n + e.qty, 0);
    const subtotal = entries.reduce((t, e) => t + e.item.price * e.qty, 0);
    const discount = count > 0 ? 2.0 : 0;
    const tax = subtotal * 0.1;
    const total = count > 0 ? Math.max(0, subtotal + tax - discount) : 0;
    return {
      entries, count, subtotal, discount, tax, total,
      payMethod, setPayMethod,
      add, inc, dec, remove, clear,
    };
  }, [lines, payMethod]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

export const fmt = (n) => `$${n.toFixed(2)}`;
