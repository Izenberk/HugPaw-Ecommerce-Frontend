// /src/context/CartContext.jsx
import { useEffect } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { useUser } from "@/context/UserContext.jsx";

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
  const { user } = useUser();
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

  const addMany = (list = []) =>
    setItems((prev) => {
      const out = [...prev];
      for (const incoming of list) {
        const item = {
          ...incoming,
          quantity: Math.max(1, num(incoming.quantity, 1)),
          unitPrice: resolveUnitPrice(incoming),
          config: incoming.config ?? {},
        };
        const idx = out.findIndex((it) => sameVariant(it, item));
        if (idx < 0) out.unshift(item);
        else
          out[idx] = {
            ...out[idx],
            quantity: num(out[idx].quantity, 1) + item.quantity,
          };
      }
      return out;
    });

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

  const importFromProfile = () => {
    const base = Array.isArray(user?.userCart) ? user.userCart : [];
    const favs = Array.isArray(user?.favoriteCart)
      ? user.favoriteCart.map((f) => ({
          productId: f.productId,
          quantity: 1,
          unitPrice: 0,
          config: f.config || {},
        }))
      : [];
    addMany([...base, ...favs]);
  };

  useEffect(() => {
    if (
      user?.id &&
      items.length === 0 &&
      (Array.isArray(user.userCart) || Array.isArray(user.favoriteCart))
    ) {
      importFromProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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
        (sum, it) =>
          sum + num(it.unitPrice, 0) * Math.max(1, num(it.quantity, 1)),
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
      addMany,
      importFromProfile,
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

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
