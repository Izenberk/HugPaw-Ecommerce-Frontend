import { calcPrice, getDefaultConfig, normalizeConfig, serializeConfig, toCartItem, validateConfig } from "@/lib/productOptions";
import { assertProductShape } from "@/lib/productSchemas";
import { useMemo, useState } from "react";


export default function ProductDetail({ product, onAddToCart, onSavePreset }) {
    // guard authoring issues in dev
    try { assertProductShape(product); } catch (e) { console.error(e); }

    const [cfg, setCfg] = useState(() => normalizeConfig(product, getDefaultConfig(product)));
    const price = useMemo(() => calcPrice(product, cfg), [product, cfg]);
    const { ok, errors } = useMemo(() => validateConfig(product, cfg), [product, cfg]);

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

    const handleAddToCart = () => {
        if (!ok) return;
        const item = toCartItem(product, cfg, 1);
        onAddToCart ? onAddToCart(item) : console.log("cartItem", item);
    };

    const handleSavePreset = async () => {
        const qs = serializeConfig(cfg);
        onSavePreset ? onSavePreset(qs) : console.log("preset", qs);
        if (navigator?.clipboard.writeText) {
            // eslint-disable-next-line no-empty
            try { await navigator.clipboard.writeText(qs); } catch {}
        }
    };

    return (
        <div className="mx-auto max-w-3xl p-4 space-y-6">
            <header className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {product.name}
                    </h1>
                    {product.description && <p className="text-sm text-muted-foreground">{product.description}</p>}
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold">{price.toLocaleString()}</div>
                    {!ok && <div className="text-xs text-red-500">Please complete required</div>}
                </div>
            </header>

            {/* Gallery */}
            {product.images?.[0] && (
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full rounded-xl border"
                />
            )}

            {/* Option Groups */}
            <section className="space-y-5">
                {(product.optionGroups || []).map((g) => (
                    <Group
                        key={g.key}
                        group={g}
                        value={cfg[g.key]}
                        error={errors?.[g.key]}
                        onPick={(val) =>
                            g.type === "single" ? setSingle(g.key, val) : toggleMulti(g.key, val)
                        }
                    />
                ))}
            </section>

            {/* Actions */}
            <footer className="flex gap-3">
                <button
                    onClick={handleAddToCart}
                    disabled={!ok}
                    className="rounded-xl px-4 py-2 border bg-primary text-primary-foreground disabled:opacity-50"
                >
                    Add to Cart
                </button>
                <button
                onClick={handleSavePreset}
                className="rounded-xl px-4 py-2 border"
                >
                    Save Preset
                </button>
            </footer>

        </div>
    )
}

function Group({ group, value, error, onPick }) {
    const labelCls = "text-sm font-medium";
    const helpCls = "text-xs text-muted-foreground"
    return (
        <div>
            <div className="mb-2 flex items-center gap-2">
                <span className={labelCls}>{group.label}</span>
                {group.required && <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100">Required</span>}
                {error && <span className="text-xs text-red-500">• required</span>}
            </div>

            {group.type === "single" ? (
                <div className="flex flex-wrap gap-2">
                    {group.values.map((v) => {
                        const active = value === v.value;
                        const base = "px-3 py-1.5 rounded-lg border";
                        const cls = active ? `${base} bg-black text-white` : `${base} hover:bg-muted`;
                        return (
                            <button key={v.value} onClick={() => onPick(v.value)} className={cls} title={v.label}>
                                {group.ui === "swatch" && v.swatch ? (
                                    <span className="inline-block w-4 h-4 rounded mr-2 align-middle" style={{ background: v.swatch }} />
                                ) : null}
                                <span className="align-middle">{v.label}</span>
                                {typeof v.priceAdj === "number" && v.priceAdj !== 0 && (
                                    <span className="ml-2 text-xs opacity-70">({v.priceAdj > 0 ? "+" : ""}{v.priceAdj})</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {group.values.map((v) => {
                        const checked = Array.isArray(value) && value.includes(v.value);
                        const base = "px-3 py-1.5 rounded-lg border";
                        const cls = checked ? `${base} bg-black text-white` : `${base} hover:bg-muted`;
                        return (
                            <button key={v.value} onClick={() => onPick(v.value)} className={cls}>
                                <span className="mr-2">{checked ? "✓" : ""}</span>{v.label}
                                {typeof v.priceAdj === "number" && v.priceAdj !== 0 && (
                                    <span className="ml-2 text-xs opacity-70">({v.priceAdj > 0 ? "+" : ""}{v.priceAdj})</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {group.help && <p className={helpCls}>{group.help}</p>}
        </div>
    );
}