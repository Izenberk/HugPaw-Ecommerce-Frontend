// hooks/useInventoryApi.js
import { useCallback, useMemo, useState } from "react";

export default function useInventoryApi() {
  const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:3030";
  const [map, setMap] = useState({}); // stored with UPPERCASE keys

  // --- SKU key normalization helpers ---
  const norm = (s) => String(s ?? "").trim();
  const keySku = (s) => norm(s).toUpperCase();

  // Safe reader: tolerate any casing from the caller
  const getInv = useCallback(
    (sku) => {
      if (!sku) return undefined;
      const kU = keySku(sku);
      // try exact, upper, lower — but we store as UPPERCASE anyway
      return map[sku] ?? map[kU] ?? map[norm(sku).toLowerCase()];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map]
  );

  // Normalize one API record into our canonical shape
  const adaptItem = (raw = {}) => {
    const sku =
      raw.sku ?? raw.SKU ?? raw.id ?? raw.Id ?? raw.Sku ?? raw.code ?? null;

    // Price field normalization (choose one that exists)
    const priceLike =
      raw.unitPrice ??
      raw.price ??
      raw.priceTHB ??
      raw.price_thb ??
      raw.thb ??
      raw.amount ??
      raw.salePrice ??
      raw.msrp ??
      raw.unit_price ??
      null;

    // Stock normalization (optional)
    const stockLike =
      raw.stockAmount ?? raw.stock ?? raw.available ?? raw.availableQty ?? null;

    return {
      ...raw,
      sku, // keep normalized sku alongside the raw fields
      // Only set these if present; don't clobber richer upstream structure
      ...(priceLike != null ? { unitPrice: priceLike } : {}),
      ...(stockLike != null ? { stockAmount: stockLike } : {}),
    };
  };

  const checkInventory = useCallback(
    async (skus = []) => {
      const uniq = Array.from(new Set(skus.filter(Boolean).map(norm)));
      if (!uniq.length) return {};

      const res = await fetch(`${API_BASE}/api/inventory/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skus: uniq }),
      });
      if (!res.ok) throw new Error("inventory check failed");

      const data = await res.json();
      const items = Array.isArray(data?.items) ? data.items : [];

      // 1) Adapt incoming
      const adapted = items
        .map(adaptItem)
        .filter((it) => it.sku != null && norm(it.sku) !== "");

      // 2) Merge into map using UPPERCASE keys
      setMap((prev) => {
        // normalize existing keys → uppercase
        const prevUpper = Object.fromEntries(
          Object.entries(prev).map(([k, v]) => [keySku(k), v])
        );

        // build next delta
        const delta = {};
        for (const it of adapted) {
          const k = keySku(it.sku);
          // merge shallowly so we keep any previous fields but allow updates
          delta[k] = { ...prevUpper[k], ...it };
        }

        return { ...prevUpper, ...delta };
      });

      // Return a shallow object with just the requested SKUs (normalized)
      const out = {};
      for (const s of uniq) {
        const k = keySku(s);
        out[s] = adapted.find((it) => keySku(it.sku) === k) ?? getInv(s);
      }
      return out;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [API_BASE, getInv]
  );

  // Stable API surface
  const inventoryMap = useMemo(() => map, [map]);

  return {
    inventoryMap,        // object keyed by UPPERCASE SKU
    checkInventory,      // (skus: string[]) => Promise<Record<string, Item>>
    getInv,              // (sku: string) => Item | undefined (casing-agnostic)
  };
}
