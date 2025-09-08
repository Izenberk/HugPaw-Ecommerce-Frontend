import { useFavorites } from "@/lib/favorites";
import { formatTHB } from "@/lib/formatters";
import { calcPrice, getDefaultConfig, normalizeConfig, toCartItem, validateConfig } from "@/lib/productOptions";
import { assertProductShape } from "@/lib/productSchemas";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAddToCartToast } from "@/hooks/useAddToCartToast";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";


export default function ProductCustom({ product, onAddToCart }) {
    const addToCartToast = useAddToCartToast({ onAdd: onAddToCart });
    const { items = [] } = useCart?.() ?? { items: [] };


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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const findVariant = (sel) => {
    const vs = product.variants || [];
    if (!vs.length) return null;
    return vs.find(v =>
        requiredSingles.every(k => v.attrs?.[k] === sel?.[k])
    ) || null;
    };

    const sameVariant = (a, b) =>
        a.productId === b.productId &&
        JSON.stringify(a.config || {}) === JSON.stringify(b.config || {});

    // Current stock (only when all required singles are chosen)
    const currentVariant = useMemo(() => {
    const allFilled = requiredSingles.every(k => cfg[k]);
    if (!allFilled) return null;
    return findVariant(cfg);
    }, [cfg, requiredSingles, findVariant]);

    const currentStock = useMemo(() => {
    if (!currentVariant) return null; // not fully specified yet
    const s = currentVariant.availableQty ?? currentVariant.stock;
    return (typeof s === "number") ? s : null;
    }, [currentVariant]);

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
        return vs.some(v => {
            if (v.active === false) return false;
            const stock = v.availableQty ?? v.stock ?? Infinity;
            if (typeof stock === "number" && stock <= 0) return false;

            return requiredSingles.every(k => {
            const pick = trial[k];
            return !pick || v.attrs?.[k] === pick;
            });
        });
    }, [product.variants, cfg, featureRemaining, requiredSingles]);

    const handleAddToCart = () => {
        if (!ok) return;

        const incomingQty = 1; // or your qty picker value

        // Parent (collar) availability
        const variant = findVariant(cfg);
        const parentStock = variant?.availableQty ?? variant?.stock ?? null;

        // How many of this exact configuration already in cart
        const inCartExact = Array.isArray(items)
            ? (items.find(it =>
                it.productId === product.id &&
                JSON.stringify(it.config || {}) === JSON.stringify(cfg)
            )?.quantity ?? 0)
            : 0;

        // Remaining for the parent line
        const parentRemaining =
            (parentStock == null) ? Infinity : Math.max(0, parentStock - inCartExact);

        // Component constraints
        let limitingReason = null;
        let maxByComponents = Infinity;

        for (const featVal of selectedFeatures) {
            const meta = getFeatureMeta(featVal);
            const compStock = meta?.component?.stock;
            if (typeof compStock !== "number") continue; // treat as unlimited if unspecified

            const alreadyUsing = inCartQtyForFeature(featVal);
            const compRemaining = Math.max(0, compStock - alreadyUsing);

            if (compRemaining < maxByComponents) {
            maxByComponents = compRemaining;
            limitingReason = compRemaining === 0 ? `${meta?.label || featVal}` : limitingReason;
            }
        }

        const maxAddable = Math.min(parentRemaining, maxByComponents);

        if (maxAddable <= 0) {
            // Explain why
            const reason = limitingReason
            ? `${limitingReason} is out of stock`
            : (parentStock === 0 || parentRemaining === 0)
                ? "This variant is out of stock"
                : "Out of stock";
            toast.error("Cannot add to cart", { description: reason });
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
            // Tell user which limit hit first
            const hit =
            maxAddable === parentRemaining
                ? "collar variant stock"
                : "feature stock";
            toast.warning("Stock limit applied", {
            description: `Only ${maxAddable} available based on ${hit}.`,
            });
        }
    };

    const { addFavorite } = useFavorites();
    const handleAddToFavorite = () => {
        if (!ok) return;
        addFavorite({
            productId: product.id,
            name: product.name,
            imageUrl: product.images?.[0],
            basePrice: product.basePrice ?? product.price ?? 0,
            price,
            config: cfg,
            tags: product.tags ?? [],
        });
        toast.success("Added to wishlist", {
            description: product.name,
            duration: 2000,
            style: {
            background: "var(--success)",
            color: "var(--popover-foreground)",
            border: "var(--border)"
            }
        });
    };


    return (
        <div className="mx-auto max-w-6xl p-4 lg:p-6">
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

                    <StockStatus
                        hasVariants={Array.isArray(product.variants) && product.variants.length > 0}
                        currentStock={currentStock}
                        allRequiredChosen={requiredSingles.every(k => cfg[k])}
                        lowStockThreshold={LOW_STOCK_THRESHOLD}
                    />
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
                        onClick={handleAddToCart}
                        disabled={!ok || currentStock === 0}
                        className="rounded-xl px-4 py-2 border bg-primary text-primary-foreground hover:cursor-pointer hover:border-primary-foreground disabled:opacity-50"
                    >
                        Add to Cart
                    </button>
                    <button
                        onClick={handleAddToFavorite}
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
