import { useFavorites } from "@/lib/favorites";
import { formatTHB } from "@/lib/formatters";
import { calcPrice, getDefaultConfig, normalizeConfig, toCartItem, validateConfig } from "@/lib/productOptions";
import { assertProductShape } from "@/lib/productSchemas";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import useRequireLogin from "@/hooks/useRequireLogin";
import { AlertTriangle, PawPrint, XCircle } from "lucide-react";
import { useAddToCartToast } from "@/hooks/useAddToCartToast";
import { useAddToFavoriteToast } from "@/hooks/useAddToFavoriteToast";
import { showToast } from "@/lib/toast";

    // helper: stable stringify (avoid key-order mismatches)
    const stableKey = (cfg = {}) =>
        JSON.stringify(Object.entries(cfg).sort(([a], [b]) => a.localeCompare(b)));

    const makeVariantKey = (cfg = {}, keys = []) =>
        JSON.stringify(keys.map(k => [k, cfg?.[k] ?? null]));
export default function ProductCustom({ product }) {
    const addToCartToast = useAddToCartToast();
    const { items = [] } = useCart?.() ?? { items: [] };

    const { requireLogin } = useRequireLogin({
        icon: <PawPrint className="text-primary" />,  // 👈 pass JSX here
    });

    // guard authoring issues in dev
    try { assertProductShape(product); } catch (e) { console.error(e); }

    const [cfg, setCfg] = useState(() =>
        normalizeConfig(product, getDefaultConfig(product))
    );
    const price = useMemo(() => calcPrice(product, cfg), [product, cfg]);
    const { ok, errors } = useMemo(() => validateConfig(product, cfg), [product, cfg]);

    // If we navigated here from Favorites -> "View detail", prefill with preset
    const location = useLocation();
    useEffect(() => {
        const preset = location.state?.preset;
        if (preset && typeof preset === "object") {
            setCfg((prev) => normalizeConfig(product, { ...prev, ...preset }));
        }
    }, [location.state?.preset, product]);

    const setSingle = (groupKey, value) => {
        const next = normalizeConfig(product, { ...cfg, [groupKey]: value });
        setCfg(next);
    };

    const toggleMulti = (groupKey, value) => {
        const cur = new Set(cfg[groupKey] || []);
        cur.has(value) ? cur.delete(value) : cur.add(value);
        const next = normalizeConfig(product, { ...cfg, [groupKey]: Array.from(cur) });
        setCfg(next);
    };

    // Which required single groups uniquely identify a variant
    const requiredSingles = useMemo(
        () => (product.optionGroups || [])
            .filter(g => g.required && g.type === "single")
            .map(g => g.key),
        [product.optionGroups]
    );

    // Find the exact SKU for a fully-specified selection
    const findVariant = useCallback((sel) => {
        const vs = product.variants || [];
        if (!vs.length) return null;
        return (
            vs.find((v) => requiredSingles.every((k) => v.attrs?.[k] === sel?.[k])) ||
            null
        );
    }, [product.variants, requiredSingles]);

    // eslint-disable-next-line no-unused-vars
    const sameVariant = (a, b) =>
        a.productId === b.productId &&
        JSON.stringify(a.config || {}) === JSON.stringify(b.config || {});

    // Current stock (only when all required singles are chosen)
    const currentVariant = useMemo(() => {
    const allFilled = requiredSingles.every(k => cfg[k]);
    if (!allFilled) return null;
    return findVariant(cfg);
    }, [cfg, requiredSingles, findVariant]);

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

    const currentStock = useMemo(() => {
    if (!currentVariant) return null;             // not fully specified yet
    const raw = currentVariant.availableQty ?? currentVariant.stock;
    const n = Number(raw);                        // handle "5" (string) correctly
    if (!Number.isFinite(n)) return null;         // treat non-numeric as unknown
    return Math.max(0, n - inCartForVariant);     // ✅ all lines of this variant
    }, [currentVariant, inCartForVariant]);

    const LOW_STOCK_THRESHOLD = 5;

    // 1) read selected features and their component stocks
    const featureGroup = useMemo(
        () => (product.optionGroups || []).find(g => g.key === "features"),
        [product.optionGroups]
    );

    const selectedFeatures = useMemo(
    () => Array.isArray(cfg.features) ? cfg.features : [],
    [cfg.features]
    );

    const getFeatureMeta = useCallback(
        (val) => featureGroup?.values?.find(v => v.value === val) || null,
        [featureGroup]
    );

    // 2) how many of a given feature are already in the cart (across all lines)
    const inCartQtyForFeature = useCallback((value) => {
        return items.reduce((sum, it) => {
            const has = Array.isArray(it?.config?.features) && it.config.features.includes(value);
            return sum + (has ? (it.quantity || 0) : 0);
        }, 0);
    }, [items]);

    // Remaining stock for a feature's component SKU (treat missing/NaN as unlimited)
    const featureRemaining = useCallback((val) => {
        const meta = getFeatureMeta(val);
        const raw = meta?.component?.stock;      // might be "5" (string)
        const stock = Number(raw);
        if (!Number.isFinite(stock)) return Infinity; // treat as unlimited if not a finite number
        const used = inCartQtyForFeature(val);
        return Math.max(0, stock - used);
    }, [getFeatureMeta, inCartQtyForFeature]);

        // Disable choices that can never form an in-stock, active SKU
    const isSelectable = useCallback((groupKey, candidate) => {
        if (groupKey === "features") {
            return featureRemaining(candidate) > 0;
        }

        // existing combo-aware logic for required singles ↓
        const vs = product.variants || [];
        if (!vs.length) return true;
        const trial = { ...cfg, [groupKey]: candidate };
        return vs.some((v) => {
            if (v.active === false) return false;
            const raw = v.availableQty ?? v.stock;
            const n = Number(raw);
            // if a finite number and <=0 → not selectable
            if (Number.isFinite(n) && n <= 0) return false;
            return requiredSingles.every((k) => {
                const pick = trial[k];
                return !pick || v.attrs?.[k] === pick;
            });
        });
    }, [product.variants, cfg, featureRemaining, requiredSingles]);

    // Pretty-print the selected variant, e.g. "Collar (Red, XL)"
    function describeVariant(product, variant, cfg) {
    const name = product?.name || "This variant";
    const ogs = product?.optionGroups || [];
    // Prefer variant.attrs, fall back to cfg for safety
    const attrs = variant?.attrs || {};
    const parts = Object.keys(attrs).map((key) => {
        const group = ogs.find((g) => g.key === key);
        const value = cfg?.[key] ?? attrs[key];
        const label = group?.values?.find((v) => v.value === value)?.label ?? String(value);
        return label;
    }).filter(Boolean);

    return parts.length ? `${name} (${parts.join(", ")})` : name;
    }

    const handleAddToCart = () => {
        if (!ok) return;

        const incomingQty = 1; // or your qty picker value

        // Parent (collar) availability
        const variant = findVariant(cfg);
        // normalize parent stock to a number (null = unknown/unlimited)
        const parentRaw = variant?.availableQty ?? variant?.stock;
        const parentNum = Number(parentRaw);
        const parentStock = Number.isFinite(parentNum) ? parentNum : null;

        // How many of this VARIANT are already in cart (ignores smart features)
        const parentRemaining =
            parentStock == null ? Infinity : Math.max(0, Number(parentStock) - inCartForVariant);

        // Component constraints
        let limitingReason = null;
        let maxByComponents = Infinity;

        for (const featVal of selectedFeatures) {
            const meta = getFeatureMeta(featVal);
            const compStock = meta?.component?.stock;
            // treat missing / non-numeric as unlimited
            const compNum = Number(compStock);
            if (!Number.isFinite(compNum)) continue;

            const alreadyUsing = inCartQtyForFeature(featVal);
            const compRemaining = Math.max(0, compNum - alreadyUsing);

            if (compRemaining < maxByComponents) {
            maxByComponents = compRemaining;
            limitingReason = compRemaining === 0 ? `${meta?.label || featVal}` : limitingReason;
            }
        }

        const maxAddable = Math.min(parentRemaining, maxByComponents);

        if (maxAddable <= 0) {
            const variantLabel = describeVariant(product, variant, cfg);
            let reason;
            if (limitingReason) {
                reason = `${limitingReason} is out of stock`;
            } else if (parentStock === 0) {
                reason = `${variantLabel} is out of stock`;
            } else if (parentRemaining === 0 && parentStock != null && parentStock > 0) {
                reason = `You already added all available stock for ${variantLabel} (max ${parentStock}).`;
            } else {
                reason = "Out of stock";
            }

            showToast(
                "error",
                {
                icon: <XCircle size={18} />,
                title: "Cannot add to cart",
                description: reason,
                },
                { duration: 3500 }
            );
            return;
        }

        const addQty = Math.min(incomingQty, maxAddable);

        const item = toCartItem(product, cfg, addQty) || {};
        const adapted = {
            ...item,
            quantity: addQty,
            unitPrice: item.unitPrice ?? item.price ?? price,
            name: product.name ?? item.name,
            imageUrl: product.images?.[0] ?? item.imageUrl,
            config: cfg,
            sku: variant?.sku ?? item.sku ?? null,
        };

        addToCartToast(adapted);

        if (addQty < incomingQty) {
            const hit =
                maxAddable === parentRemaining ? "collar variant stock" : "feature stock";

            showToast(
                "warn",
                {
                icon: <AlertTriangle size={18} />,
                title: "Stock limit applied",
                description: `Only ${maxAddable} available based on ${hit}.`,
                },
                { duration: 3500 }
            );
        }
    };

    const { addFavorite } = useFavorites();
    const addFavWithToast = useAddToFavoriteToast({ onAdd: addFavorite });

    const handleAddToFavorite = () => {
        if (!ok) return;
        // Shape the item you want in favorites:
        addFavWithToast({
        productId: product.id,
        name: product.name,
        imageUrl: product.images?.[0],
        price: price ?? product.basePrice ?? product.price ?? 0,
        config: cfg,
        tags: product.tags ?? [],
        });
    };

    return (
<div className="mx-auto max-w-6xl p-6 lg:p-12 mt-10 lg:mt-14">
  <div className="grid gap-6 lg:gap-10 lg:grid-cols-12">

                {/* LEFT: Gallery (desktop only) */}
                <section className="hidden lg:block lg:col-span-7">
                {product.images?.[0] && (
                    <div className="w-full overflow-hidden rounded-xl border">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                    />
                    </div>
                )}
                </section>

                {/* RIGHT (desktop) / STACKED (mobile) */}
                <aside className="lg:col-span-5 flex flex-col gap-6">

                {/* Mobile Name */}
                <h1 className="text-2xl font-semibold">{product.name}</h1>

                {/* Mobile Image */}
                <div className="w-full overflow-hidden rounded-xl border lg:hidden">
                    {product.images?.[0] && (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                    />
                    )}
                </div>

                {/* Price + Stock */}
                <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-bold">
                        {formatTHB(price)}
                        {!ok && <span className="ml-2 text-xs text-red-500">• complete required</span>}
                    </div>

                    {/* compute remaining for display */}
                    {(() => {
                    return (
                        <StockStatus
                            hasVariants={Array.isArray(product.variants) && product.variants.length > 0}
                            currentStock={currentStock}  // remaining count (variant minus same-config in cart)
                            allRequiredChosen={requiredSingles.every(k => cfg[k])}
                            lowStockThreshold={LOW_STOCK_THRESHOLD}
                        />
                    );
                    })()}
                </div>

                {/* Description */}
                {product.description && (
                    <ReadMore text={product.description} initialLines={2}/>
                )}

                {/* Options */}
                <section aria-label="Product options" className="space-y-5">
                    {(product.optionGroups || []).map((g) => (
                        <Group
                        key={g.key}
                        group={g}
                        value={cfg[g.key]}
                        error={errors?.[g.key]}
                        onPick={(val) =>
                            g.type === "single" ? setSingle(g.key, val) : toggleMulti(g.key, val)
                        }
                        isSelectable={isSelectable}
                        />
                    ))}
                </section>

                {/* Actions */}
                <footer className="flex gap-3">
                    <button
                        onClick={requireLogin(() => handleAddToCart())}
                        disabled={!ok || currentStock === 0}
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

function Group({ group, value, error, onPick, isSelectable }) {
    const labelCls = "text-sm font-medium";
    const helpCls = "text-xs text-muted-foreground";

    return (
        <div>
        <div className="mb-2 flex items-center gap-2">
            <span className={labelCls}>{group.label}</span>
            {group.required && <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100">Required</span>}
            {error && <span className="text-xs text-red-500">• required</span>}
        </div>

        <div className="flex flex-wrap gap-2">
            {group.values.map((v) => {
            const active = group.type === "single"
                ? value === v.value
                : Array.isArray(value) && value.includes(v.value);

            const selectable = isSelectable ? isSelectable(group.key, v.value) : true;

            // Important: don't lock a selected feature; allow user to unselect it.
            const disabled = (!selectable && !active) || v.disabled;

            const base = "px-3 py-1.5 rounded-lg border hover:cursor-pointer hover:border-primary-foreground";
            const cls = disabled
                ? `${base} opacity-40 cursor-not-allowed`
                : active ? `${base} bg-black text-white` : `${base} hover:bg-muted`;

            return (
                <button
                key={v.value}
                disabled={disabled}
                onClick={() => !disabled && onPick(v.value)}
                className={cls}
                title={v.label}
                >
                {group.ui === "swatch" && v.swatch && (
                    <span className="inline-block w-4 h-4 rounded mr-2 align-middle" style={{ background: v.swatch }} />
                )}
                <span className="align-middle">{v.label}</span>
                {typeof v.priceAdj === "number" && v.priceAdj !== 0 && (
                    <span className="ml-2 text-xs opacity-70">
                    ({v.priceAdj > 0 ? "+" : ""}{v.priceAdj})
                    </span>
                )}
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
    const cls = open ? "" : `line-clamp-${initialLines}`; // works if you enabled the line-clamp plugin
    return (
        <div>
        <p className={`text-sm text-muted-foreground ${cls}`}>{text}</p>
        {text.length > 120 && (
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
