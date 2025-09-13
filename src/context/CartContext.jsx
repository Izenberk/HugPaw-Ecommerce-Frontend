// /src/context/CartContext.jsx
import { useEffect } from "react";
import { createContext, useContext, useMemo, useState } from "react";
const CartCtx = createContext(null);

// helpers: numeric + stable stringify for config
const num = (v, def = 0) => (Number.isFinite(+v) ? +v : def);
const stableKey = (cfg = {}) =>
  JSON.stringify(Object.entries(cfg).sort(([a], [b]) => a.localeCompare(b)));

const resolveUnitPrice = (src) => {
  if (Number.isFinite(+src?.unitPrice)) return +src.unitPrice;
  if (Number.isFinite(+src?.price)) return +src.price;
  if (Number.isFinite(+src?.basePrice)) return +src.basePrice;
  return 0;
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      const arr = saved ? JSON.parse(saved) : [];
      // sanitize on load
      return Array.isArray(arr)
        ? arr.map((it) => ({
            ...it,
            quantity: Math.max(1, num(it.quantity, 1)),
            unitPrice: resolveUnitPrice(it),
            config: it.config ?? {},
          }))
        : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState(
    () => localStorage.getItem("promoCode") || ""
  );
  const [appliedCode, setAppliedCode] = useState(() => {
    // OPTIONAL: persist appliedCode too
    try {
      return localStorage.getItem("appliedCode") || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (promoCode) localStorage.setItem("promoCode", promoCode);
    else localStorage.removeItem("promoCode");
  }, [promoCode]);

  // OPTIONAL: keep appliedCode in sync
  useEffect(() => {
    if (appliedCode) localStorage.setItem("appliedCode", appliedCode);
    else localStorage.removeItem("appliedCode");
  }, [appliedCode]);

  const sameVariant = (a, b) =>
    a.productId === b.productId &&
    stableKey(a.config || {}) === stableKey(b.config || {});

  const addItem = (incoming) =>
    setItems((prev) => {
      // normalize the incoming payload
      const item = {
        ...incoming,
        quantity: Math.max(1, num(incoming.quantity, 1)),
        unitPrice: resolveUnitPrice(incoming),
        config: incoming.config ?? {},
      };

      const idx = prev.findIndex((it) => sameVariant(it, item));
      if (idx < 0) return [item, ...prev]; // prepend helps UX (new item on top)

      return prev.map((it, i) =>
        i === idx
          ? { ...it, quantity: num(it.quantity, 1) + item.quantity }
          : it
      );
    });

  const updateQty = (target, nextQty) => {
    setItems((prev) =>
      prev
        .map((it) =>
          sameVariant(it, target)
            ? { ...it, quantity: Math.max(1, num(nextQty, 1)) }
            : it
        )
        .filter((it) => num(it.quantity, 1) > 0)
    );
  };

  const removeItem = (target) => {
    setItems((prev) => prev.filter((it) => !sameVariant(it, target)));
  };

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + num(it.unitPrice, 0) * Math.max(1, num(it.quantity, 1)),
        0
      ),
    [items]
  );

  const increment = (target) => updateQty(target, num(target.quantity, 1) + 1);
  const decrement = (target) =>
    updateQty(target, Math.max(1, num(target.quantity, 1) - 1));

  const clearCart = () => {
    localStorage.removeItem("cartItems");
    setItems([]);
    // (optional) also clear promo state
    setPromoCode("");
    setAppliedCode("");
  };

  const cartCount = useMemo(
    () => items.reduce((sum, it) => sum + Math.max(1, num(it.quantity, 1)), 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQty,
      increment,
      decrement,
      removeItem,
      clearCart,
      promoCode,
      setPromoCode,
      appliedCode,
      setAppliedCode,
      subtotal,
      cartCount,
    }),
    [items, subtotal, promoCode, appliedCode, cartCount]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
