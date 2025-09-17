// hooks/useInventoryApi.js
import { useCallback, useState } from "react";

export default function useInventoryApi() {
  const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:3030";
  const [map, setMap] = useState({}); // { sku: {available, stock} }

  const check = useCallback(async (skus = []) => {
    const uniq = Array.from(new Set(skus.filter(Boolean)));
    if (!uniq.length) return {};
    const res = await fetch(`${API_BASE}/api/inventory/availability`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skus: uniq }),
    });
    if (!res.ok) throw new Error("inventory check failed");
    const data = await res.json();
    const next = {};
    for (const it of data.items || []) next[it.sku] = it;
    setMap(next);
    return next;
  }, [API_BASE]);

  return { inventoryMap: map, checkInventory: check };
}
