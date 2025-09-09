import { useMemo, useCallback } from "react";

export default function useFeatureStock(product, cfg) {
    const featureGroup = useMemo(
        () => (product.optionGroups || []).find(g => g.key === "features"),
        [product.optionGroups]
    );

    const selectedFeatures = useMemo(
        () => Array.isArray(cfg?.features) ? cfg.features : [],
        [cfg?.features]
    );

    const getFeatureMeta = useCallback(
        (val) => featureGroup?.values?.find(v => v.value === val) || null,
        [featureGroup]
    );

    const inCartQtyForFeature = useCallback((items=[], value) => {
        return items.reduce((sum, it) => {
        const has = Array.isArray(it?.config?.features) && it.config.features.includes(value);
        return sum + (has ? (it.quantity || 0) : 0);
        }, 0);
    }, []);

    const featureRemaining = useCallback((items=[], val) => {
        const meta = getFeatureMeta(val);
        const raw = meta?.component?.stock;
        const n = Number(raw);
        if (!Number.isFinite(n)) return Infinity; // treat as unlimited
        const used = inCartQtyForFeature(items, val);
        return Math.max(0, n - used);
    }, [getFeatureMeta, inCartQtyForFeature]);

    // MIN across selected features
    const maxByComponents = useCallback((items=[]) => {
        let min = Infinity;
        for (const feat of selectedFeatures) {
        const rem = featureRemaining(items, feat);
        if (rem < min) min = rem;
        }
        return min;
    }, [selectedFeatures, featureRemaining]);

    const isSelectable = useCallback((groupKey, candidate, items=[]) => {
        if (groupKey === "features") {
        return featureRemaining(items, candidate) > 0;
        }
        return true; // singles/others handled by variant logic elsewhere
    }, [featureRemaining]);

    return {
        selectedFeatures,
        getFeatureMeta,
        inCartQtyForFeature,
        featureRemaining,
        maxByComponents,
        isSelectable,
    };
}
