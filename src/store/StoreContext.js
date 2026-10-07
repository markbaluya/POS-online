import React, { createContext, useContext, useMemo, useState } from 'react';

const RATES = { '$': 1, '₱': 58.5, '€': 0.92, '₹': 83.2 }; // USD base, update as needed

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [store, setStore] = useState({
    name: "Mark's Restaurant",
    hours: '8:00 AM - 10:00 PM',
    currency: '$',
    footer: 'Thank you, come again!',
    methodsEnabled: { Cash: true, Card: true, QR: true },
  });

  const value = useMemo(
    () => ({
      store,
      update: (patch) => setStore((s) => ({ ...s, ...patch })),
      setMethodEnabled: (m, on) =>
        setStore((s) => ({
          ...s,
          methodsEnabled: { ...s.methodsEnabled, [m]: on },
        })),
      money: (n) => {
        const rate = RATES[store.currency] ?? 1;
        return `${store.currency}${(n * rate).toFixed(2)}`;
      },
    }),
    [store],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};
