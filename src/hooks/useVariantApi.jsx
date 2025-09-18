import { useCallback, useRef, useState } from "react";

export default function useVariantApi(anchorSku) {
  const [avail, setAvail] = useState(null);
  const cacheRef = useRef(new Map()); // Map<variantKeyJson, variant>

    // Prefer env var; fallback to your dev backend port
    const API_BASE =
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ||
      "http://localhost:3030/api/v1";
    // All endpoints below assume your Express mounts product routes under /api

  const variantKeyFrom = useCallback((sel, keys) => {
    const pairs = keys.map(k => [k, sel?.[k] ?? null]);
    return JSON.stringify(pairs);
  }, []);

  const fetchAvailability = useCallback(async (selections) => {
    const sku = encodeURIComponent(anchorSku);
    const res = await fetch(`${API_BASE}/variants/${sku}/availability`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selections })
    });
    if (!res.ok) throw new Error("availability failed");
    const data = await res.json();
    setAvail(data?.byOption || {});
    return data?.byOption || {};
  }, [anchorSku, API_BASE]);

  const findVariantRemote = useCallback(async (selections, requiredSingles) => {
    const key = variantKeyFrom(selections, requiredSingles);
    if (cacheRef.current.has(key)) return cacheRef.current.get(key);

    const singlesOnly = Object.fromEntries(
      (requiredSingles || []).map(k => [k, selections?.[k]])
      .filter(([,v]) => v != null && v !== "")
    );

    const res = await fetch(`${API_BASE}/variants/${encodeURIComponent(anchorSku)}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selections: singlesOnly })   // must include { Color: "Blue", Size: "M" }
    });
    if (!res.ok) return null;
    const v = await res.json();
    cacheRef.current.set(key, v);
    return v;
    }, [anchorSku, variantKeyFrom, API_BASE]);

  return { avail, setAvail, fetchAvailability, findVariantRemote, variantKeyFrom };
}
