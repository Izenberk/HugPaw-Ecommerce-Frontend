import { useFavorites } from "@/lib/favorites";
import { formatTHB } from "@/lib/formatters";
import { calcPrice, getDefaultConfig, normalizeConfig, toCartItem, validateConfig } from "@/lib/productOptions";
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

const makeVariantKey = (cfg = {}, keys = []) =>
  JSON.stringify(keys.map((k) => [k, cfg?.[k] ?? null]));

// parse numbers from "฿300", "300.00 THB", etc.
const toNum = (x) => {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  if (typeof x === "string") {
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
  };

  // Resolve exact variant when singles are filled
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

  // Cart/stock
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

  // -------- DYNAMIC ADD-ON GROUP DETECTION --------
  const featureGroup = useMemo(() => {
    const groups = Array.isArray(product.optionGroups) ? product.optionGroups : [];
    const byKey = groups.find((g) => g.key === "features");
    if (byKey) return byKey;

    // Heuristics: multi-select and looks like add-ons/features
    const guess = groups.find((g) => {
      if (g?.type !== "multi") return false;
      const label = String(g?.label || g?.key || "").toLowerCase();
      return (
        label.includes("feature") ||
        label.includes("add-on") ||
        label.includes("addon") ||
        label.includes("module")
      );
    });
    return guess || null;
  }, [product.optionGroups]);

  // -------- Inventory API & controlled fetch --------
  const { inventoryMap, checkInventory } = useInventoryApi();

  // Track in-flight requests and prevent re-fetching the same SKU
  const requestedSkusRef = useRef(new Set());
  const [inflightRequests, setInflightRequests] = useState(0);
  const pricingLoading = inflightRequests > 0;

  const fetchSkuPricesIfNeeded = useCallback(async (skus) => {
    if (!Array.isArray(skus) || skus.length === 0) return;

    const toRequest = skus.filter((sku) => !requestedSkusRef.current.has(sku));
    if (toRequest.length === 0) return;

    // mark as requested to avoid loops even if API returns no price
    toRequest.forEach((sku) => requestedSkusRef.current.add(sku));

    try {
      setInflightRequests((n) => n + 1);
      await checkInventory(toRequest);
    } catch (e) {
      console.warn("checkInventory failed for", toRequest, e);
    } finally {
      setInflightRequests((n) => Math.max(0, n - 1));
    }
  }, [checkInventory]);

  // Selected features (by detected key)
  const selectedFeatures = useMemo(() => {
    const key = featureGroup?.key;
    if (!key) return [];
    const raw = cfg[key];
    return Array.isArray(raw) ? raw : [];
  }, [cfg, featureGroup]);

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

  // ---- Multi-select toggle (features) + availability refresh ----
  const toggleMulti = async (groupKey, value) => {
    const cur = new Set(cfg[groupKey] || []);
    cur.has(value) ? cur.delete(value) : cur.add(value);
    const next = normalizeConfig(product, { ...cfg, [groupKey]: Array.from(cur) });
    setCfg(next);

    // Features don't constrain variant availability; still refresh hints with touched singles
    fetchAvailability(singlesFromKeys(next, touchedSingles)).catch(console.error);

    // Opportunistically fetch price by SKU if this is the add-on group
    if (groupKey === featureGroup?.key) {
      const meta = getFeatureMeta(value);
      const sku = meta?.sku;
      if (sku) fetchSkuPricesIfNeeded([sku]);
    }
  };

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

  // --- Price readers ---
  const getFeaturePrice = useCallback((val) => {
    const meta = getFeatureMeta(val);
    if (!meta) return 0;

    // 1) price on option value
    let raw =
      meta.unitPrice ??
      meta.price ??
      meta.priceDelta ??
      meta.delta ??
      meta.addonPrice ??
      meta.adjust;

    // 2) fallback: inventory price (if present)
    if ((raw == null || raw === "") && meta.sku) {
      const rec = inventoryMap?.[meta.sku];
      raw = rec?.unitPrice ?? rec?.price ?? raw;
    }
    return toNum(raw ?? 0);
  }, [getFeatureMeta, inventoryMap]);

  // --- Price computation ---
  // Base price prefers unitPrice to match your sample DB
  const basePrice = useMemo(() => {
    const raw =
      resolvedVariant?.unitPrice ??
      resolvedVariant?.price ??
      product.unitPrice ??
      product.basePrice ??
      product.price ??
      calcPrice(product, normalizeConfig(product, cfg));
    return toNum(raw ?? 0);
  }, [resolvedVariant, product, cfg]);

  const featuresPrice = useMemo(
    () => selectedFeatures.reduce((sum, val) => sum + getFeaturePrice(val), 0),
    [selectedFeatures, getFeaturePrice]
  );

  const displayPrice = useMemo(
    () => basePrice + featuresPrice,
    [basePrice, featuresPrice]
  );

  // Add to Cart enablement rule
  const canAddToCart =
    ok &&
    !!resolvedVariant &&
    (currentStock === null || currentStock > 0) &&
    featureOOS.length === 0;

  // Pretty-print variant
  function describeVariant(product, variant, cfg) {
    const name = product?.name || "This variant";
    const ogs = product?.optionGroups || [];
    const attrs = variant?.attrs || {};
    const parts = Object.keys(attrs)
      .map((key) => {
        const group = ogs.find((g) => g.key === key);
        const value = cfg?.[key] ?? attrs[key];
        const label = group?.values?.find((v) => v.value === value)?.label ?? String(value);
        return label;
      })
      .filter(Boolean);

    return parts.length ? `${name} (${parts.join(", ")})` : name;
  }

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
      unitPrice: item.unitPrice ?? item.price ?? displayPrice,
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
              unavailableCombination={requiredSingles.every((k) => cfg[k]) && !resolvedVariant}
              featureOOS={featureOOS.map((f) => getFeatureMeta(f)?.label || f)}
              lowStockThreshold={LOW_STOCK_THRESHOLD}
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

          // Consistent solid border & hover for all states; chips always clickable
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
              onClick={() => onPick(v.value)}
              className={cls}
              aria-pressed={active ? "true" : "false"}
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

function StockStatus({
  hasVariants,
  currentStock,
  allRequiredChosen,
  unavailableCombination = false,
  featureOOS = [],
  lowStockThreshold = 5,
}) {
  if (!hasVariants) return null;

  // Build status items in order of priority
  const items = [];

  if (!allRequiredChosen) {
    items.push({
      kind: "info",
      text: "Select required options",
      icon: null,
      cls: "text-muted-foreground border-muted",
    });
  } else if (unavailableCombination) {
    items.push({
      kind: "error",
      text: "Combination unavailable",
      icon: XCircle,
      cls: "text-red-700 border-red-300",
    });
  } else if (currentStock === 0) {
    items.push({
      kind: "error",
      text: "Out of stock",
      icon: XCircle,
      cls: "text-red-700 border-red-300",
    });
  } else if (typeof currentStock === "number" && currentStock > 0) {
    const low = currentStock <= lowStockThreshold;
    items.push({
      kind: low ? "warn" : "ok",
      text: low ? `Low stock: ${currentStock}` : `In stock: ${currentStock}`,
      icon: low ? AlertTriangle : CheckCircle,
      cls: low ? "text-amber-700 border-amber-300" : "text-emerald-700 border-emerald-300",
    });
  }

  // Add-on warnings are shown in addition to the main availability state
  if (allRequiredChosen && featureOOS.length > 0) {
    items.push({
      kind: "warn",
      text: `Add-on unavailable: ${featureOOS.join(", ")}`,
      icon: AlertTriangle,
      cls: "text-amber-700 border-amber-300",
    });
  }

  if (!items.length) return null;

  return (
    <div aria-live="polite" className="text-xs font-medium flex flex-wrap gap-2">
      {items.map((it, idx) => {
        const Icon = it.icon;
        return (
          <span
            key={idx}
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${it.cls}`}
          >
            {Icon ? <Icon size={14} className="shrink-0" /> : null}
            {it.text}
          </span>
        );
      })}
    </div>
  );
}
