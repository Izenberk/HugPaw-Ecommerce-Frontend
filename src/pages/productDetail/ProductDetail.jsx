import useLoginAlert from "@/hooks/useLoginAlert";
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
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ProductDetail({ product, onAddToCart }) {
  // guard authoring issues in dev
  try {
    assertProductShape(product);
  } catch (e) {
    console.error(e);
  }

  const [cfg, setCfg] = useState(() =>
    normalizeConfig(product, getDefaultConfig(product))
  );
  const price = useMemo(() => calcPrice(product, cfg), [product, cfg]);
  const { ok, errors } = useMemo(
    () => validateConfig(product, cfg),
    [product, cfg]
  );

  // If we navigated here from Favorites -> "Vuew detail", prefill with preset
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
    const next = normalizeConfig(product, {
      ...cfg,
      [groupKey]: Array.from(cur),
    });
    setCfg(next);
  };

  const handleAddToCart = () => {
    if (!ok) return;
    const item = toCartItem(product, cfg, 1) || {};
    const adapted = {
      ...item,
      quantity: item.quantity ?? 1,
      unitPrice: item.unitPrice ?? item.price ?? price,
      name: product.name,
      imageUrl: product.images?.[0],
    };
    onAddToCart ? onAddToCart(adapted) : console.log("cartItem", adapted);
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
  };


  const stopIfLoggedOut = useLoginAlert("Please log in to access the cart.");

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

          {/* Price */}
          <div className="text-2xl font-bold">
            {formatTHB(price)}
            {!ok && (
              <div className="text-xs text-red-500">
                Please complete required
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <ReadMore text={product.description} initialLines={2} />
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
                  g.type === "single"
                    ? setSingle(g.key, val)
                    : toggleMulti(g.key, val)
                }
              />
            ))}
          </section>

          {/* Actions */}
          <footer className="flex gap-3">
            <button
              onClick={(e) => stopIfLoggedOut(e) && handleAddToCart(e)}
              disabled={!ok}
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

function Group({ group, value, error, onPick }) {
  const labelCls = "text-sm font-medium";
  const helpCls = "text-xs text-muted-foreground";
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className={labelCls}>{group.label}</span>
        {group.required && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100">
            Required
          </span>
        )}
        {error && <span className="text-xs text-red-500">• required</span>}
      </div>

      {group.type === "single" ? (
        <div className="flex flex-wrap gap-2">
          {group.values.map((v) => {
            const active = value === v.value;
            const base =
              "px-3 py-1.5 rounded-lg border hover:cursor-pointer hover:border-primary-foreground";
            const cls = active
              ? `${base} bg-black text-white`
              : `${base} hover:bg-muted`;
            return (
              <button
                key={v.value}
                onClick={() => onPick(v.value)}
                className={cls}
                title={v.label}
              >
                {group.ui === "swatch" && v.swatch ? (
                  <span
                    className="inline-block w-4 h-4 rounded mr-2 align-middle"
                    style={{ background: v.swatch }}
                  />
                ) : null}
                <span className="align-middle">{v.label}</span>
                {typeof v.priceAdj === "number" && v.priceAdj !== 0 && (
                  <span className="ml-2 text-xs opacity-70">
                    ({v.priceAdj > 0 ? "+" : ""}
                    {v.priceAdj})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {group.values.map((v) => {
            const checked = Array.isArray(value) && value.includes(v.value);
            const base =
              "px-3 py-1.5 rounded-lg border hover:cursor-pointer hover:border-primary-foreground";
            const cls = checked
              ? `${base} bg-black text-white`
              : `${base} hover:bg-muted`;
            return (
              <button
                key={v.value}
                onClick={() => onPick(v.value)}
                className={cls}
              >
                <span className="mr-2">{checked ? "✓" : ""}</span>
                {v.label}
                {typeof v.priceAdj === "number" && v.priceAdj !== 0 && (
                  <span className="ml-2 text-xs opacity-70">
                    ({v.priceAdj > 0 ? "+" : ""}
                    {v.priceAdj})
                  </span>
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
