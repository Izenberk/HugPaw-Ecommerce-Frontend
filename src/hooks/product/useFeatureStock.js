// src/hooks/product/useFeatureStock.js
import { useCallback, useMemo } from "react";
import { useCart } from "@/context/CartContext";

export default function useFeatureStock(product, cfg, requiredSingles) {
    const { items = [] } = useCart?.() ?? { items: [] };

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

    const inCartQtyForFeature = useCallback((value) => {
        return items.reduce((sum, it) => {
        const has = Array.isArray(it?.config?.features) && it.config.features.includes(value);
        return sum + (has ? (it.quantity || 0) : 0);
        }, 0);
    }, [items]);

    const featureRemaining = useCallback((val) => {
        const meta = getFeatureMeta(val);
        const raw = meta?.component?.stock;
        const stock = Number(raw);
        if (!Number.isFinite(stock)) return Infinity;
        const used = inCartQtyForFeature(val);
        return Math.max(0, stock - used);
    }, [getFeatureMeta, inCartQtyForFeature]);

    // combo-aware option enabling
    const isSelectable = useCallback((groupKey, candidate, cfgLocal = cfg) => {
        if (groupKey === "features") {
        return featureRemaining(candidate) > 0;
        }

        const vs = product.variants || [];
        if (!vs.length) return true;

        const trial = { ...cfgLocal, [groupKey]: candidate };
        return vs.some(v => {
        if (v.active === false) return false;
        const stock = v.availableQty ?? v.stock ?? Infinity;
        if (typeof stock === "number" && stock <= 0) return false;

        return requiredSingles.every(k => {
            const pick = trial[k];
            return !pick || v.attrs?.[k] === pick;
        });
        });
    }, [product.variants, featureRemaining, requiredSingles, cfg]);

    return {
        featureGroup,
        selectedFeatures,
        getFeatureMeta,
        inCartQtyForFeature,
        featureRemaining,
        isSelectable,
    };
}
