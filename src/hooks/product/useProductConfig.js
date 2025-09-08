// src/hooks/product/useProductConfig.js
import { useEffect, useMemo, useState } from "react";
import { calcPrice, getDefaultConfig, normalizeConfig, validateConfig } from "@/lib/productOptions";
import { assertProductShape } from "@/lib/productSchemas";
import { useLocation } from "react-router-dom";

export default function useProductConfig(product) {
    // guard authoring issues in dev
    try { assertProductShape(product); } catch (e) { console.error(e); }

    const [cfg, setCfg] = useState(() =>
        normalizeConfig(product, getDefaultConfig(product))
    );

    // prefill when navigated with a preset (Favorites → View detail)
    const location = useLocation();
    useEffect(() => {
        const preset = location.state?.preset;
        if (preset && typeof preset === "object") {
        setCfg(prev => normalizeConfig(product, { ...prev, ...preset }));
        }
    }, [location.state?.preset, product]);

    const setSingle = (groupKey, value) => {
        setCfg(prev => normalizeConfig(product, { ...prev, [groupKey]: value }));
    };

    const toggleMulti = (groupKey, value) => {
        setCfg(prev => {
        const curSet = new Set(prev[groupKey] || []);
        curSet.has(value) ? curSet.delete(value) : curSet.add(value);
        return normalizeConfig(product, { ...prev, [groupKey]: Array.from(curSet) });
        });
    };

    const price = useMemo(() => calcPrice(product, cfg), [product, cfg]);
    const { ok, errors } = useMemo(() => validateConfig(product, cfg), [product, cfg]);

    return { cfg, setSingle, toggleMulti, price, ok, errors };
}
