export const OPT_SINGLE = "single";
export const OPT_MULTI = "multi";

/**
 * Product shape (simplified):
 * {
 *   id, name, basePrice, images:[],
 *   optionGroups: [
 *     {
 *       key, label, type: 'single'|'multi', required?:boolean, ui?:'swatch'|'buttons'|'dropdown'|'checkbox',
 *       values: [{ value, label, priceAdj?:number, swatch?:string, image?:string, default?:boolean }]
 *     }
 *   ],
 *   variants?: [ // optional SKU mapping for classic variant products
 *     { sku, attrs: { [groupKey]: value }, price?:number, stock?:number }
 *   ]
 * }
 */

// Returns the option group by key
export function getGroup(product, key) {
    return product?.optionGroups?.find(g => g.key === key) ?? null;
}

// Returns the option value metadata for a given group/value
export function getOption(product, groupKey, value) {
    const g = getGroup(product, groupKey);
    if (!g) return null;
    return g.values.find(v => v.value === value) ?? null;
}

// Build a default configuration for product
export function getDefaultConfig(product) {
    const cfg = {};
    for (const g of product.optionGroups || []) {
        if (g.type === OPT_SINGLE) {
            const def = g.values.find(v => v.default) ?? g.values[0];
            cfg[g.key] = def?.value ?? null;
        } else if (g.type === OPT_MULTI) {
            const defaults = g.values.filter(v => v.default).map(v => v.value);
            cfg[g.key] = defaults;
        }
    }
    return cfg;
}

// Normalize an incoming config (form URL / storage) to valud values
export function normalizeConfig(product, cfg={}) {
    const out = {};
    for (const g of product.optionGroups || []) {
        const raw = cfg[g.key];
        if (g.type === OPT_SINGLE) {
            const val = typeof raw === "string" ? raw : null;
            out[g.key] = getOption(product, g.key, val)?.value
            ?? getDefaultConfig(product)[g.key]
            ?? null;
        } else {
            const arr = Array.isArray(raw) ? raw : [];
            // keep only valid, unique values
            const set = new Set(
                arr.filter(v => !!getOption(product, g.key, v))
            );
            out[g.key] = Array.from(set);
        }
    }
    return out;
}

export function validateConfig(product, cfg) {
    const errors = {};
    for (const g of product.optionGroups || []) {
        if (!g.required) continue;
        if (g.type === OPT_SINGLE) {
            if (!cfg[g.key]) errors[g.key] = "required";
        } else if (g.type === OPT_MULTI) {
            if (!Array.isArray(cfg[g.key]) || cfg[g.key].length === 0) {
                errors[g.key] = "required";
            }
        }
    }
    return { ok: Object.keys(errors).length === 0, errors};
}

// Option-level price adjustment sun for a given config
export function optionAdjTotal(product, cfg) {
    let total = 0;
    for (const g of product.optionGroups || []) {
        if (g.type === OPT_SINGLE) {
            const v = getOption(product, g.key, cfg[g.key]);
            if (v?.priceAdj) total += v.priceAdj;
        } else if (g.type === OPT_MULTI) {
            for (const val of cfg[g.key] || []) {
                const v = getOption(product, g.key, val);
                if (v?.priceAdj) total += v.priceAdj;
            }
        }
    }
    return total;
}

// Try to pick a variant/SKU from single-select attrs (ignores multi)
export function pickVariant(product, cfg) {
    if (!Array.isArray(product.variants) || product.variants.length === 0) return null;
    return product.variants.find(variant => {
        return Object.entries(variant.attrs || {}).every(([k, v]) => cfg[k] === v);
    }) ?? null;
}

// Calculate final price = (variant.price ?? basePrice) + option adjustments
export function calcPrice(product, cfg) {
    const variant = pickVariant(product, cfg);
    const base = typeof variant?.price === "number" ? variant.price : product.basePrice;
    return round2(base + optionAdjTotal(product, cfg));
}

export function serializeConfig(cfg) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(cfg || {})) {
        if (Array.isArray(v)) {
            if (v.length) params.set(k, v.join(","));
        } else if (v != null) {
            params.set(k, String(v));
        }
    }
    return params.toString();
}

export function parseConfig(str) {
    const params = new URLSearchParams(str || "");
    const out = {};
    for (const [k, v] of params.entries()) {
        out[k] = v.includes(",") ? v.split(",").filter(Boolean) : v;
    }
    return out;
}

// Build a cart item payload (Structure you can send to your cart store/API)
export function toCartItem(product, cfg, qty = 1) {
    const variant = pickVariant(product, cfg);
    const price = calcPrice(product, cfg);

    // selected options for UI/cart
    const selected = [];
    for (const g of product.optionGroups || []) {
        if (g.type === OPT_SINGLE) {
            const v = getOption(product, g.key, cfg[g.key]);
            if (v) selected.push({ key: g.key, label: g.label, values: [{ value: v.value, label: v.label }] });
        } else {
            const values = (cfg[g.key] || [])
                .map(val => getOption(product, g.key, val))
                .filter(Boolean)
                .map(v => ({ value: v.value, label: v.label }));
            if (values.length) selected.push({ key: g.key, label: g.label, values });
        }
    }

    return {
        productId: product.id,
        sku: variant?.sku ?? null,
        name: product.name,
        image: product.images?.[0] ?? null,
        quantity: qty,
        unitPrice: price,
        option: selected,
        config: cfg
    };
}

function round2(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
}

// Example product data
export const SAMPLE_COLLAR = {
    id: "collar-001",
    name: "HugPaw Smart Collar",
    basePrice: 600,
    images: ["src/assets/images/products/Collar1.jpg"],
    description: "More than just a collar It's their identity… Give your pet a collar that reflects who they are. Customize the color, size, and even engrave their name. Want extra peace of mind? Add GPS tracking and app connectivity to keep them safe, wherever they roam.",
    optionGroups: [
        {
            key: "color",
            label: "Color",
            type: OPT_SINGLE,
            required: true,
            ui: "swatch",
            values: [
                { value: "red", label: "Red", swatch: "#EF4444" },
                { value: "blue", label: "Blue", swatch: "#3B82F6" },
                { value: "black", label: "Black", swatch: "#111827", default: true },
            ]
        },
        {
            key: "size",
            label: "Size",
            type: OPT_SINGLE,
            required: true,
            ui: "buttons",
            values: [
                { value: "XS", label: "XS", priceAdj: -70 },
                { value: "S", label: "S", },
                { value: "M", label: "M", default: true },
                { value: "L", label: "L", priceAdj: 70 },
                { value: "XL", label: "XL", priceAdj: 120 },
            ]
        },
        {
            key: "features",
            label: "Smart Features",
            type: OPT_MULTI,
            required: false,
            ui: "checkbox",
            values: [
                { value: "gps", label: "GPS Tracker", priceAdj: 350 },
                { value: "led", label: "LED Light", priceAdj: 180 },
                { value: "nfc", label: "NFC Tag", priceAdj: 100 },
            ]
        }
    ],
    variants: [
        { sku: "COL-RED-XS", attrs: { color: "red", size: "XS" }, price: 530 },
        { sku: "COL-BLUE-M", attrs: { color: "blue", size: "M" }, price: 600 },
        { sku: "COL-BLACK-XL", attrs: { color: "black", size: "XL" }, price: 720 },
    ]
};