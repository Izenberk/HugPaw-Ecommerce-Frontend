// /src/pages/userCart/CartContext.jsx
import { createContext, useContext, useMemo, useState } from "react";
const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const sameVariant = (a, b) =>
    a.productId === b.productId &&
    JSON.stringify(a.config || {}) === JSON.stringify(b.config || {});

  const addItem = (incoming) => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => sameVariant(it, incoming));
      if (idx === -1) return [...prev, { ...incoming }];
      const copy = [...prev];
      copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + (incoming.quantity || 1) };
      return copy;
    });
  };

  const updateQty = (target, nextQty) => {
    setItems((prev) =>
      prev
        .map((it) => (sameVariant(it, target) ? { ...it, quantity: Math.max(1, nextQty) } : it))
        .filter((it) => it.quantity > 0)
    );
  };

  const removeItem = (target) => {
    setItems((prev) => prev.filter((it) => !sameVariant(it, target)));
  };

  // 🟢 รวมยอดตามจำนวนชิ้น
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0),
    [items]
  );

  // 🟢 ฟังก์ชันกด + / –
  const increment = (target) => updateQty(target, target.quantity + 1);
  const decrement = (target) => updateQty(target, Math.max(1, target.quantity - 1));

  const value = useMemo(
    () => ({ items, addItem, updateQty, increment, decrement, removeItem, subtotal }),
    [items, subtotal]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
