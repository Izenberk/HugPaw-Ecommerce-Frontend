// src/hooks/product/useVariantStock.js
import { useMemo } from "react";

export default function useVariantStock(product, cfg) {
    const requiredSingles = useMemo(
        () => (product.optionGroups || [])
        .filter(g => g.required && g.type === "single")
        .map(g => g.key),
        [product.optionGroups]
    );

    const findVariant = (sel) => {
        const vs = product.variants || [];
        if (!vs.length) return null;
        return vs.find(v =>
        requiredSingles.every(k => v.attrs?.[k] === sel?.[k])
        ) || null;
    };

    const currentVariant = useMemo(() => {
        const allFilled = requiredSingles.every(k => cfg[k]);
        if (!allFilled) return null;
        return findVariant(cfg);
    }, [cfg, requiredSingles]);

    const currentStock = useMemo(() => {
        if (!currentVariant) return null;
        const s = currentVariant.availableQty ?? currentVariant.stock;
        return (typeof s === "number") ? s : null;
    }, [currentVariant]);

    const allRequiredChosen = requiredSingles.every(k => cfg[k]);

    return { requiredSingles, findVariant, currentVariant, currentStock, allRequiredChosen };
}
