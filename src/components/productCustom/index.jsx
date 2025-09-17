import { useFavorites } from "@/lib/favorites";
import { formatTHB } from "@/lib/formatters";
import {
  calcPrice,
  getDefaultConfig,
  normalizeConfig,
  toCartItem,
  validateConfig,
} from "@/lib/productOptions";
import { assertProductShape } from "@/lib/productSchemas";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import useRequireLogin from "@/hooks/useRequireLogin";
import { AlertTriangle, PawPrint, XCircle, CheckCircle } from "lucide-react";
import { useAddToCartToast } from "@/hooks/useAddToCartToast";
import { useAddToFavoriteToast } from "@/hooks/useAddToFavoriteToast";
import { showToast } from "@/lib/toast";
import useVariantApi from "@/hooks/useVariantApi";
import useInventoryApi from "@/hooks/useInventoryApi";

const DEBUG_ADDONS = true;
const dlog = (...args) => { if (DEBUG_ADDONS) console.log("[addons]", ...args); };

const makeVariantKey = (cfg = {}, keys = []) =>
  JSON.stringify(keys.map((k) => [k, cfg?.[k] ?? null]));

// parse numbers from "฿300", "300.00 THB", etc.
const toNum = (x) => {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  if (typeof x === "string") {
    // eslint-disable-next-line no-useless-escape
    const n = parseFloat(x.replace(/[^0-9.\-]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

export default function ProductCustom({ product }) {
  const addToCartToast = useAddToCartToast();
  const { items = [] } = useCart?.() ?? { items: [] };

  const { requireLogin } = useRequireLogin({
    icon: <PawPrint className="text-primary" />,
  });

  // guard authoring issues in dev
  try { assertProductShape(product); } catch (e) { console.error(e); }
  if (DEBUG_ADDONS) {
    dlog("optionGroups:", (product.optionGroups || []).map(g => ({
      key: g.key, type: g.type, label: g.label, values: (g.values||[]).length
    })));
  }

  const [cfg, setCfg] = useState(() =>
    normalizeConfig(product, getDefaultConfig(product))
  );
  const [resolvedVariant, setResolvedVariant] = useState(null);

  const { ok, errors } = useMemo(
    () => validateConfig(product, cfg),
    [product, cfg]
  );

  // Favorites preset merge
  const location = useLocation();
  useEffect(() => {
    const preset = location.state?.preset;
    if (preset && typeof preset === "object") {
      setCfg((prev) => normalizeConfig(product, { ...prev, ...preset }));
    }
  }, [location.state?.preset, product]);

  // Variant API (family anchored by SKU)
  const { avail, fetchAvailability, findVariantRemote } =
    useVariantApi(product.anchorSku || product.sku);

  // Required single groups
  const requiredSingles = useMemo(
    () =>
      (product.optionGroups || [])
        .filter((g) => g.required && g.type === "single")
        .map((g) => g.key),
    [product.optionGroups]
  );

  // Track which singles the user changed (for nicer availability hints)
  const [touchedSingles, setTouchedSingles] = useState(() => new Set());

  const singlesFrom = useCallback(
    (obj) =>
      Object.fromEntries(
        requiredSingles
          .map((k) => [k, obj?.[k]])
          .filter(([, v]) => v != null && v !== "")
      ),
    [requiredSingles]
  );

  const singlesFromKeys = useCallback(
    (obj, keys) =>
      Object.fromEntries(
        Array.from(keys)
          .map((k) => [k, obj?.[k]])
          .filter(([, v]) => v != null && v !== "")
      ),
    []
  );

  // Start with no constraints so everything looks explorable
  useEffect(() => {
    fetchAvailability({}).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------- DYNAMIC ADD-ON GROUP DETECTION (single or multi) --------
  const featureGroup = useMemo(() => {
    const groups = Array.isArray(product.optionGroups) ? product.optionGroups : [];
    const byKey = groups.find(g => g.key === "features");
    if (byKey) return byKey;

    const looksAddon = (g) => {
      const label = String(g?.label || g?.key || "").toLowerCase();
      return (
        label.includes("feature") ||
        label.includes("add-on") ||
        label.includes("addon") ||
        label.includes("module")
      );
    };
    const guess = groups.find(looksAddon) || null;
    if (DEBUG_ADDONS) {
      dlog("detected featureGroup:", guess ? { key: guess.key, type: guess.type, label: guess.label } : null);
    }
    return guess;
  }, [product.optionGroups]);

  // -------- Inventory API & controlled fetch --------
  const { inventoryMap, checkInventory, getInv } = useInventoryApi();

  // Track in-flight requests and prevent re-fetching the same SKU
  const requestedSkusRef = useRef(new Map());
  // shape per SKU: { requested: boolean, tries: number, lastFetched: number, hadPrice: boolean }

  const [inflightRequests, setInflightRequests] = useState(0);
  const pricingLoading = inflightRequests > 0;

  const inventoryHasPrice = (rec) => {
    if (!rec) return false;
    const candidates = [
      rec.unitPrice, rec.price, rec.unit_price, rec.msrp,
      rec.amount, rec.cost, rec.thb, rec.priceTHB, rec.price_thb, rec.salePrice
    ];
    return candidates.some((v) => Number.isFinite(Number(v)));
  };

  /**
   * Fetch inventory for SKUs.
   * - Skips when we already have a price for that SKU (fast path).
   * - Retries up to MAX_TRIES unless force=true.
   * - Cooldown prevents hammering if backend is silent.
   */
  const MAX_TRIES = 3;
  const COOLDOWN_MS = 3_000;

  const fetchSkuPricesIfNeeded = useCallback(
    async (skus, { force = false } = {}) => {
      if (!Array.isArray(skus) || skus.length === 0) return;

      const toRequest = [];

      for (const sku of skus) {
        const rec = getInv(sku);
        const meta = requestedSkusRef.current.get(sku) || {
          requested: false,
          tries: 0,
          lastFetched: 0,
          hadPrice: false,
        };

        // If we already have a price in memory, don't fetch again
        if (inventoryHasPrice(rec)) {
          meta.hadPrice = true;
          requestedSkusRef.current.set(sku, meta);
          dlog("have price already for", sku, rec);
          continue;
        }

        // Decide whether to fetch
        let shouldFetch = false;
        if (force) {
          shouldFetch = true;
        } else {
          const now = Date.now();
          const cooledDown = now - meta.lastFetched > COOLDOWN_MS;
          const underLimit = meta.tries < MAX_TRIES;
          const neverRequested = !meta.requested;

          shouldFetch = neverRequested || (cooledDown && underLimit);
        }

        if (shouldFetch) {
          toRequest.push(sku);
          requestedSkusRef.current.set(sku, {
            requested: true,
            tries: meta.tries + 1,
            lastFetched: Date.now(),
            hadPrice: false,
          });
        }
      }

      if (toRequest.length === 0) {
        dlog(
          "no fetch needed; already requested & no force, or we have price:",
          skus
        );
        return;
      }

      dlog("fetching inventory for:", toRequest);
      try {
        setInflightRequests((n) => n + 1);
        await checkInventory(toRequest);
        // After fetch, log what we got
        toRequest.forEach((sku) => {
          const rec = inventoryMap?.[sku];
          const meta = requestedSkusRef.current.get(sku);
          if (meta) {
            meta.hadPrice = inventoryHasPrice(rec);
            meta.lastFetched = Date.now();
            requestedSkusRef.current.set(sku, meta);
          }
          dlog("post-fetch snapshot:", { sku, rec });
        });
      } catch (e) {
        console.warn("[addons] checkInventory failed for", toRequest, e);
      } finally {
        setInflightRequests((n) => Math.max(0, n - 1));
      }
    },
    [checkInventory, inventoryMap]
  );

  // ------- Selected features (normalize to array for single/multi) -------
  const selectedFeatures = useMemo(() => {
    const key = featureGroup?.key;
    if (!key) return [];
    const raw = cfg[key];
    return Array.isArray(raw) ? raw : (raw == null || raw === "" ? [] : [raw]);
  }, [cfg, featureGroup]);

  useEffect(() => {
    dlog("group type:", featureGroup?.type, "selected values:", selectedFeatures);
  }, [featureGroup?.type, selectedFeatures]);

  const getFeatureMeta = useCallback(
    (val) => featureGroup?.values?.find((v) => v.value === val) || null,
    [featureGroup]
  );

  // Initial fetch for all add-on SKUs (once)
  useEffect(() => {
    const skus = (featureGroup?.values || []).map((v) => v.sku).filter(Boolean);
    if (skus.length) fetchSkuPricesIfNeeded(skus);
  }, [featureGroup, fetchSkuPricesIfNeeded]);

  // On selection change, fetch any newly selected SKUs not requested yet
  useEffect(() => {
    const need = selectedFeatures
      .map(getFeatureMeta)
      .map((m) => m?.sku)
      .filter(Boolean);
    if (need.length) fetchSkuPricesIfNeeded(need);
  }, [selectedFeatures, getFeatureMeta, fetchSkuPricesIfNeeded]);

  // Helper used inline so you don't need to define anything elsewhere
  const _hasInventoryPrice = (rec) => {
    if (!rec) return false;
    const candidates = [
      rec.unitPrice, rec.price, rec.unit_price, rec.msrp,
      rec.amount, rec.cost, rec.thb, rec.priceTHB, rec.price_thb, rec.salePrice
    ];
    return candidates.some((v) => Number.isFinite(Number(v)));
  };

  // ---- Multi-select toggle (features) + availability refresh ----
  const toggleMulti = async (groupKey, value) => {
    const cur = new Set(cfg[groupKey] || []);
    // toggle value
    cur.has(value) ? cur.delete(value) : cur.add(value);

    const next = normalizeConfig(product, { ...cfg, [groupKey]: Array.from(cur) });
    setCfg(next);

    // Features don't constrain variant availability; still refresh hints with touched singles
    fetchAvailability(singlesFromKeys(next, touchedSingles)).catch(console.error);

    // 🔍 Debug log
    console.debug("[addons:toggleMulti]", {
      groupKey,
      toggledValue: value,
      isAddonGroup: groupKey === featureGroup?.key,
      current: Array.from(cur),
    });

    // Only worry about pricing/inventory when this is the add-on group
    if (groupKey === featureGroup?.key) {
      const meta = getFeatureMeta(value);
      const sku = meta?.sku;
      console.debug("[addons:toggleMulti] meta:", meta, "sku:", sku);

      // If we just deselected the option, don't fetch
      const nowSelected = Array.from(cur).includes(value);
      if (!nowSelected) {
        console.debug("[addons:toggleMulti] deselected; skipping fetch for", value);
        return;
      }

      if (sku) {
        const rec = inventoryMap?.[sku];
        const hasPrice = inventoryHasPrice(rec);
        if (!hasPrice) {
          console.debug("[addons:toggleMulti] forcing fetch due to missing price for", sku, rec);
          // IMPORTANT: force=true to bypass “already requested” guard
          fetchSkuPricesIfNeeded([sku], { force: true });
        } else {
          console.debug("[addons:toggleMulti] have price in inventory for", sku, rec);
        }
      }
    }
  };


  // ------- Price readers (declare BEFORE any effect that uses them) -------
  const readAnyPriceLike = (obj) => {
    if (!obj) return undefined;
    const keys = [
      "unitPrice","price","priceDelta","delta","addonPrice","adjust",
      // common alternates
      "unit_price","msrp","amount","cost","thb","priceTHB","price_thb","salePrice"
    ];
    for (const k of keys) {
      const v = obj[k];
      if (v != null && v !== "") return v;
    }
    return undefined;
  };

  const getFeaturePrice = useCallback((val) => {
    const meta = getFeatureMeta(val);
    if (!meta) { dlog("price meta missing for", val); return 0; }

    // 1) price on option value (wide alias support)
    let raw = readAnyPriceLike(meta);

    // 2) fallback: inventory price (if present)
    if ((raw == null || raw === "") && meta.sku) {
      const rec = inventoryMap?.[meta.sku];
      raw = readAnyPriceLike(rec);
    }

    const num = toNum(raw ?? 0);
    dlog("price for", val, "→", num, "(raw:", raw, ", sku:", meta.sku, ")");
    return num;
  }, [getFeatureMeta, inventoryMap]);

  // --- Base & totals (declare BEFORE logging effects to avoid TDZ) ---
  const basePrice = useMemo(() => {
    const raw = resolvedVariant?.unitPrice ?? resolvedVariant?.price
            ?? product.unitPrice ?? product.basePrice ?? product.price
            // If your calcPrice includes add-ons, DO NOT fall back to it here.
            // Otherwise keep this fallback:
            ?? calcPrice(product, normalizeConfig(product, cfg));
    if (typeof raw === "number" && Number.isFinite(raw)) return raw;
    if (typeof raw === "string") {
      // eslint-disable-next-line no-useless-escape
      const n = parseFloat(raw.replace(/[^0-9.\-]/g, ""));
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  }, [resolvedVariant, product, cfg]);

  const featuresPrice = useMemo(
    () => selectedFeatures.reduce((sum, val) => sum + getFeaturePrice(val), 0),
    [selectedFeatures, getFeaturePrice]
  );

  const displayPrice = useMemo(
    () => basePrice + featuresPrice,
    [basePrice, featuresPrice]
  );

  // ---- Logging effect (placed AFTER basePrice/featuresPrice definitions) ----
  useEffect(() => {
    dlog("PRICES base:", basePrice, "features:", featuresPrice, "total:", basePrice + featuresPrice);
  }, [basePrice, featuresPrice]);

  // ------------------ setSingle (after helpers exist) ------------------
  const setSingle = async (groupKey, value) => {
    const next = normalizeConfig(product, { ...cfg, [groupKey]: value });
    setCfg(next);

    const nextTouched = new Set(touchedSingles);
    nextTouched.add(groupKey);
    setTouchedSingles(nextTouched);

    // Availability hints: exclude the key we're changing
    const forAvailKeys = new Set(nextTouched);
    forAvailKeys.delete(groupKey);
    fetchAvailability(singlesFromKeys(next, forAvailKeys)).catch(console.error);

    // 🔍 Debug log
    console.debug("[addons:setSingle]", {
      groupKey,
      value,
      isAddonGroup: groupKey === featureGroup?.key,
    });

    // ⬇️ Add THIS block here
    if (groupKey === featureGroup?.key) {
      const meta = getFeatureMeta(value);
      const sku = meta?.sku;
      console.debug("[addons:setSingle] meta:", meta, "sku:", sku);
      if (sku) {
        const rec = inventoryMap?.[sku];
        const hasPrice = inventoryHasPrice(rec);
        if (!hasPrice) {
          console.debug("[addons:setSingle] forcing fetch due to missing price for", sku, rec);
          // require the {force:true} signature on your fetch helper
          fetchSkuPricesIfNeeded([sku], { force: true });
        } else {
          console.debug("[addons:setSingle] have price in inventory for", sku, rec);
        }
      }
    }
  };

  // -------- Resolve exact variant when singles are filled --------
  useEffect(() => {
    const allFilled = requiredSingles.every((k) => cfg[k]);
    if (!allFilled) {
      setResolvedVariant(null);
      return;
    }
    let ignore = false;
    (async () => {
      const v = await findVariantRemote(singlesFrom(cfg), requiredSingles);
      if (!ignore) setResolvedVariant(v?.found ? v : null);
    })().catch(console.error);
    return () => { ignore = true; };
  }, [cfg, requiredSingles, singlesFrom, findVariantRemote]);

  // -------- Cart/stock --------
  const variantKey = useMemo(
    () => makeVariantKey(cfg, requiredSingles),
    [cfg, requiredSingles]
  );

  const inCartForVariant = useMemo(() => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, it) => {
      if (it.productId !== product.id) return sum;
      const itKey = makeVariantKey(it.config || {}, requiredSingles);
      return sum + (itKey === variantKey ? (it.quantity || 0) : 0);
    }, 0);
  }, [items, product.id, requiredSingles, variantKey]);

  const currentVariant = resolvedVariant;
  const currentStock = useMemo(() => {
    if (!currentVariant) return null;
    // prefer availableQty, fallback to stock, then stockAmount
    const raw = currentVariant.availableQty ?? currentVariant.stock ?? currentVariant.stockAmount;
    const n = Number(raw);
    if (!Number.isFinite(n)) return null;
    return Math.max(0, n - inCartForVariant);
  }, [currentVariant, inCartForVariant]);

  const LOW_STOCK_THRESHOLD = 5;

  // Visual availability & OOS
  const inCartQtyForFeature = useCallback((value) => {
    return items.reduce((sum, it) => {
      const has = Array.isArray(it?.config?.features) && it.config.features.includes(value);
      return sum + (has ? (it.quantity || 0) : 0);
    }, 0);
  }, [items]);

  const featureRemaining = useCallback((val) => {
    const meta = getFeatureMeta(val);
    const sku = meta?.sku;
    const rec = sku ? inventoryMap[sku] : null;
    const stockRaw = rec?.stock ?? rec?.stockAmount;
    const stock = Number(stockRaw);
    if (!Number.isFinite(stock)) return Infinity;
    const used = inCartQtyForFeature(val);
    return Math.max(0, stock - used);
  }, [getFeatureMeta, inventoryMap, inCartQtyForFeature]);

  const isOptionVisuallyAvailable = useCallback(
    (groupKey, candidate) => {
      if (groupKey === featureGroup?.key) return featureRemaining(candidate) > 0;
      const groupAvail = avail?.[groupKey];
      if (Array.isArray(groupAvail)) {
        const row = groupAvail.find((r) => r.value === candidate);
        return row ? !!row.available : true;
      }
      return true;
    },
    [avail, featureGroup?.key, featureRemaining]
  );

  const featureOOS = useMemo(
    () => selectedFeatures.filter((f) => featureRemaining(f) === 0),
    [selectedFeatures, featureRemaining]
  );

  // Add to Cart enablement rule
  const canAddToCart =
    ok &&
    !!resolvedVariant &&
    (currentStock === null || currentStock > 0) &&
    featureOOS.length === 0;

  // Pretty-print variant (fixed duplicate code)
  function describeVariant(product, variant, cfg) {
    const name = product?.name || "This variant";
    const ogs = product?.optionGroups || [];
    const attrs = variant?.attrs || {};
    const parts = Object.keys(attrs)
      .map((key) => {
        const group = ogs.find((g) => g.key === key);
        const value = cfg?.[key] ?? attrs[key];
        const label =
          group?.values?.find((v) => v.value === value)?.label ?? String(value);
        return label;
      })
      .filter(Boolean);

    return parts.length ? `${name} (${parts.join(", ")})` : name;
  }

  // Debug: log add-on group and selected feature prices
  useEffect(() => {
    if (!featureGroup) {
      console.debug("[addons] no featureGroup detected");
      return;
    }

    console.debug(
      "[addons] group",
      featureGroup.key,
      "type:", featureGroup.type,
      "selected:", selectedFeatures
    );

    selectedFeatures.forEach((val) => {
      const meta = getFeatureMeta(val);
      if (!meta) {
        console.debug("  •", val, "→ no meta found");
        return;
      }
      const rawCandidates = {
        unitPrice: meta.unitPrice,
        price: meta.price,
        priceDelta: meta.priceDelta,
        delta: meta.delta,
        addonPrice: meta.addonPrice,
        adjust: meta.adjust,
        invUnitPrice: meta.sku ? inventoryMap?.[meta.sku]?.unitPrice : undefined,
        invPrice: meta.sku ? inventoryMap?.[meta.sku]?.price : undefined,
      };

      console.debug("  •", val, "meta:", meta, "raw candidates:", rawCandidates);
    });
  }, [featureGroup, selectedFeatures, getFeatureMeta, inventoryMap]);

  const handleAddToCart = async () => {
    if (!canAddToCart) {
      // Give specific reason
      const allSinglesChosen = requiredSingles.every((k) => cfg[k]);
      if (!allSinglesChosen) {
        showToast("error", { icon: <XCircle size={18} />, title: "Missing options", description: "Please choose all required options." }, { duration: 2500 });
        return;
      }
      if (!resolvedVariant) {
        showToast("error", { icon: <XCircle size={18} />, title: "Combination unavailable", description: "Try a different size or color." }, { duration: 2500 });
        return;
      }
      if (currentStock === 0) {
        showToast("error", { icon: <XCircle size={18} />, title: "Out of stock", description: "That variant is currently unavailable." }, { duration: 2500 });
        return;
      }
      if (featureOOS.length > 0) {
        showToast("error", { icon: <XCircle size={18} />, title: "Add-on unavailable", description: `Remove out-of-stock add-on(s): ${featureOOS.join(", ")}` }, { duration: 2500 });
        return;
      }
      return;
    }

    const incomingQty = 1;
    const variant = resolvedVariant;

    // driver stock for the variant (prefer availableQty, then stock, then stockAmount)
    const parentRaw = variant?.availableQty ?? variant?.stock ?? variant?.stockAmount;
    const parentNum = Number(parentRaw);
    const parentStock = Number.isFinite(parentNum) ? parentNum : null;
    const parentRemaining = parentStock == null ? Infinity : Math.max(0, Number(parentStock) - inCartForVariant);

    // Component constraints at add time
    let limitingReason = null;
    let maxByComponents = Infinity;

    try {
      const skus = selectedFeatures.map(getFeatureMeta).map((m) => m?.sku).filter(Boolean);
      if (skus.length) await checkInventory(skus);
    } catch (e) { console.warn("addon inventory refresh failed", e); }

    for (const featVal of selectedFeatures) {
      const meta = getFeatureMeta(featVal);
      const rec = meta?.sku ? inventoryMap[meta.sku] : null;
      const compNum = Number(rec?.stock ?? rec?.stockAmount);
      if (!Number.isFinite(compNum)) continue; // unknown → skip as unlimited

      const alreadyUsing = inCartQtyForFeature(featVal);
      const compRemaining = Math.max(0, compNum - alreadyUsing);
      if (compRemaining < maxByComponents) {
        maxByComponents = compRemaining;
        if (compRemaining === 0) limitingReason = `${meta?.label || featVal}`;
      }
    }

    const maxAddable = Math.min(parentRemaining, maxByComponents);

    if (maxAddable <= 0) {
      const variantLabel = describeVariant(product, variant, cfg);
      const reason =
        limitingReason ? `${limitingReason} is out of stock`
        : parentStock === 0 ? `${variantLabel} is out of stock`
        : parentRemaining === 0 && parentStock != null && parentStock > 0
          ? `You already added all available stock for ${variantLabel} (max ${parentStock}).`
          : "Out of stock";

      showToast("error", { icon: <XCircle size={18} />, title: "Cannot add to cart", description: reason }, { duration: 3500 });
      return;
    }

    const addQty = Math.min(incomingQty, maxAddable);
    const item = toCartItem(product, cfg, addQty) || {};
    const adapted = {
      ...item,
      quantity: addQty,
      // Prefer existing unitPrice from item; else computed displayPrice
      unitPrice: displayPrice ?? item.unitPrice ?? item.price,
      name: product.name ?? item.name,
      imageUrl: product.images?.[0] ?? item.imageUrl,
      config: cfg,
      sku: variant?.sku ?? item.sku ?? null,
    };

    addToCartToast(adapted);

    if (addQty < incomingQty) {
      const hit = maxAddable === parentRemaining ? "collar variant stock" : "feature stock";
      showToast("warn", { icon: <AlertTriangle size={18} />, title: "Stock limit applied", description: `Only ${maxAddable} available based on ${hit}.` }, { duration: 3500 });
    }
  };

  const { addFavorite } = useFavorites();
  const addFavWithToast = useAddToFavoriteToast({ onAdd: addFavorite });

  const handleAddToFavorite = () => {
    if (!ok) return;
    addFavWithToast({
      productId: product.id,
      name: product.name,
      imageUrl: product.images?.[0],
      price: displayPrice, // show chosen config price
      config: cfg,
      tags: product.tags ?? [],
    });
  };

  return (
    <div className="mx-auto max-w-6xl p-4 lg:p-6">
      <div className="grid gap-6 lg:gap-10 lg:grid-cols-12">
        {/* LEFT: Gallery (desktop only) */}
        <section className="hidden lg:block lg:col-span-7">
          {product.images?.[0] && (
            <div className="w-full overflow-hidden rounded-xl border">
              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
            </div>
          )}
        </section>

        {/* RIGHT (desktop) / STACKED (mobile) */}
        <aside className="lg:col-span-5 flex flex-col gap-6">
          <h1 className="text-2xl font-semibold">{product.name}</h1>

          <div className="w-full overflow-hidden rounded-xl border lg:hidden">
            {product.images?.[0] && (
              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
            )}
          </div>

          {/* Price + Stock */}
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">
              {formatTHB(displayPrice)}
              {pricingLoading && <span className="ml-2 text-xs text-muted-foreground">pricing…</span>}
              {!ok && <span className="ml-2 text-xs text-red-500">• complete required</span>}
            </div>

            <StockStatus
              hasVariants={!!resolvedVariant || !!avail}
              allRequiredChosen={requiredSingles.every((k) => cfg[k])}
              currentStock={currentStock}
              lowStockThreshold={5}
            />
          </div>

          {/* Description */}
          {product.description && <ReadMore text={product.description} initialLines={2} />}

          {/* Options */}
          <section aria-label="Product options" className="space-y-5">
            {(product.optionGroups || []).map((g) => (
              <Group
                key={g.key}
                group={g}
                value={cfg[g.key]}
                error={errors?.[g.key]}
                onPick={(val) => (g.type === "single" ? setSingle(g.key, val) : toggleMulti(g.key, val))}
                // keep prop for compatibility; Group handles it optionally
                isAvailableVisual={(candidate) => isOptionVisuallyAvailable(g.key, candidate)}
              />
            ))}
          </section>

          {/* Actions */}
          <footer className="flex gap-3">
            <button
              onClick={requireLogin(() => handleAddToCart())}
              disabled={!canAddToCart}
              className="rounded-xl px-4 py-2 border bg-primary text-primary-foreground hover:cursor-pointer hover:border-primary-foreground disabled:opacity-50"
            >
              Add to Cart
            </button>
            <button
              onClick={requireLogin(() => handleAddToFavorite())}
              className="rounded-xl px-4 py-2 border hover:cursor-pointer hover:border-primary-foreground"
            >
              Add to Favorite
            </button>
          </footer>
        </aside>
      </div>
    </div>
  );
}

function Group({ group, value, error, onPick, isAvailableVisual }) {
  const labelCls = "text-sm font-medium";
  const helpCls = "text-xs text-muted-foreground";

  const onPickWithLog = (val) => {
    dlog("CLICK", { groupKey: group.key, groupType: group.type, value: val });
    onPick?.(val);
  };

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className={labelCls}>{group.label}</span>
        {group.required && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100">Required</span>
        )}
        {error && <span className="text-xs text-red-500">• required</span>}
      </div>

      <div className="flex flex-wrap gap-2">
        {group.values.map((v) => {
          const active =
            group.type === "single"
              ? value === v.value
              : Array.isArray(value) && value.includes(v.value);

          const available = isAvailableVisual ? isAvailableVisual(v.value) : true;

          const base =
            "px-3 py-1.5 rounded-lg border transition hover:cursor-pointer hover:bg-muted";
          const cls = [
            base,
            active ? "bg-black text-white" : "",
            !available ? "opacity-60" : ""
          ].join(" ").trim();

          return (
            <button
              key={v.value}
              onClick={() => onPickWithLog(v.value)}
              className={cls}
              aria-pressed={active ? "true" : "false"}
              data-group-key={group.key}
              data-group-type={group.type}
              data-option-value={v.value}
            >
              {group.ui === "swatch" && v.swatch && (
                <span
                  className="inline-block w-4 h-4 rounded mr-2 align-middle"
                  style={{ background: v.swatch }}
                />
              )}
              <span className="align-middle">{v.label}</span>
            </button>
          );
        })}
      </div>

      {group.help && <p className={helpCls}>{group.help}</p>}
    </div>
  );
}

function ReadMore({ text, initialLines = 3 }) {
  const [open, setOpen] = useState(false);
  const cls = open ? "" : `line-clamp-${initialLines}`;
  return (
    <div>
      <p className={`text-sm text-muted-foreground ${cls}`}>{text}</p>
      {text?.length > 120 && (
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-1 text-xs underline hover:cursor-pointer hover:opacity-70"
        >
          {open ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

function StockStatus({ hasVariants, currentStock, allRequiredChosen, lowStockThreshold = 5 }) {
  if (!hasVariants) return null; // no backend stock data → stay quiet

  return (
    <div aria-live="polite" className="text-xs font-medium">
      {!allRequiredChosen && <span className="text-muted-foreground">Select required options</span>}

      {allRequiredChosen && currentStock === 0 && (
        <span className="text-red-600">Out of stock</span>
      )}

      {allRequiredChosen && typeof currentStock === "number" && currentStock > 0 && (
        <span className={currentStock <= lowStockThreshold ? "text-amber-600" : "text-emerald-700"}>
          {currentStock <= lowStockThreshold ? `Low stock: ${currentStock}` : `In stock: ${currentStock}`}
        </span>
      )}
    </div>
  );
}
