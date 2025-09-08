// src/components/product/ProductCustom/index.jsx
import { useMemo } from "react";
import useProductConfig from "@/hooks/product/useProductConfig";
import useVariantStock from "@/hooks/product/useVariantStock";
import useFeatureStock from "@/hooks/product/useFeatureStock";

import { formatTHB } from "@/lib/formatters";
import ProductActions from "./ProductActions";
import OptionGroup from "../product/OptionGroup";
import StockStatus from "../product/StockStatus";
import ReadMore from "../product/ReadMore";

export default function ProductCustom({ product, onAddToCart, onAddToFavorite }) {
    const LOW_STOCK_THRESHOLD = 5;

    const { cfg, setSingle, toggleMulti, price, ok, errors } = useProductConfig(product);
    const { requiredSingles, findVariant, currentStock, allRequiredChosen } = useVariantStock(product, cfg);
    const { selectedFeatures, getFeatureMeta, inCartQtyForFeature, isSelectable } =
        useFeatureStock(product, cfg, requiredSingles);

    const hasVariants = useMemo(
        () => Array.isArray(product.variants) && product.variants.length > 0,
        [product.variants]
    );

    return (
        <div className="mx-auto max-w-6xl p-4 lg:p-6">
        <div className="grid gap-6 lg:gap-10 lg:grid-cols-12">
            <section className="hidden lg:block lg:col-span-7">
            {product.images?.[0] && (
                <div className="w-full overflow-hidden rounded-xl border">
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                </div>
            )}
            </section>

            <aside className="lg:col-span-5 flex flex-col gap-6">
            <h1 className="text-2xl font-semibold">{product.name}</h1>

            <div className="w-full overflow-hidden rounded-xl border lg:hidden">
                {product.images?.[0] && (
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                )}
            </div>

            <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                {formatTHB(price)}
                {!ok && <span className="ml-2 text-xs text-red-500">• complete required</span>}
                </div>
                <StockStatus
                hasVariants={hasVariants}
                currentStock={currentStock}
                allRequiredChosen={allRequiredChosen}
                lowStockThreshold={LOW_STOCK_THRESHOLD}
                />
            </div>

            {product.description && <ReadMore text={product.description} initialLines={2} />}

            <section aria-label="Product options" className="space-y-5">
                {(product.optionGroups || []).map((g) => (
                <OptionGroup
                    key={g.key}
                    group={g}
                    value={cfg[g.key]}
                    error={errors?.[g.key]}
                    onPick={(val) => (g.type === "single" ? setSingle(g.key, val) : toggleMulti(g.key, val))}
                    isSelectable={isSelectable}
                />
                ))}
            </section>

            <ProductActions
                product={product}
                cfg={cfg}
                price={price}
                ok={ok}
                currentStock={currentStock}
                findVariant={findVariant}
                selectedFeatures={selectedFeatures}
                getFeatureMeta={getFeatureMeta}
                inCartQtyForFeature={inCartQtyForFeature}
                onAddToCart={onAddToCart}
                onAddToFavorite={onAddToFavorite}
            />
            </aside>
        </div>
        </div>
    );
}