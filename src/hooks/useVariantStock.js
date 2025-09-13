import { useMemo, useCallback } from "react";
import { findVariant } from "@/lib/stockTools"; // or same file
import { normConfig } from "@/lib/stockTools";

export default function useVariantStock(product, cfg, requiredSingles) {
    const variant = useMemo(() => {
        const filled = requiredSingles.every(k => cfg?.[k]);
        return filled ? findVariant(product, cfg, requiredSingles) : null;
    }, [product, cfg, requiredSingles]);

    const currentStock = useMemo(() => {
        if (!variant) return null;
        const raw = variant.availableQty ?? variant.stock;
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
    }, [variant]);

    // how many of THIS EXACT CONFIG are already in cart
    const inCartExactQty = useCallback((items=[]) => {
        const key = normConfig(product, cfg);
        const found = items.find(it =>
        it.productId === product.id &&
        JSON.stringify(it.config || {}) === key
        );
        return found?.quantity ?? 0;
    }, [product, cfg]);

    const parentRemaining = useCallback((items=[]) => {
        if (currentStock == null) return Infinity;    // variant not selected or unlimited
        const used = inCartExactQty(items);
        return Math.max(0, currentStock - used);
    }, [currentStock, inCartExactQty]);

    const allRequiredChosen = useMemo(
        () => requiredSingles.every(k => cfg?.[k]),
        [cfg, requiredSingles]
    );

    return { variant, currentStock, parentRemaining, allRequiredChosen };
}
