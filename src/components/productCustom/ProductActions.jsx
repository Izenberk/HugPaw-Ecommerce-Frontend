// src/components/product/ProductCustom/ProductActions.jsx
import { AlertTriangle, PawPrint, XCircle } from "lucide-react";
import { toCartItem } from "@/lib/productOptions";
import { useAddToCartToast } from "@/hooks/useAddToCartToast";
import { useAddToFavoriteToast } from "@/hooks/useAddToFavoriteToast";
import useRequireLogin from "@/hooks/useRequireLogin";
import { showToast } from "@/lib/toast";

export default function ProductActions({
    product,
    cfg,
    price,
    ok,
    currentStock,
    findVariant,
    selectedFeatures,
    getFeatureMeta,
    inCartQtyForFeature,
    onAddToCart,
    onAddToFavorite,
    }) {
    const addToCartToast = useAddToCartToast();
    const addFavWithToast = useAddToFavoriteToast({ onAdd: onAddToFavorite });
    const { requireLogin } = useRequireLogin({ icon: <PawPrint className="text-primary" /> });

    const handleAddToCart = () => {
        if (!ok) return;

        const incomingQty = 1;
        const variant = findVariant(cfg);
        const parentStock = variant?.availableQty ?? variant?.stock ?? null;
        const parentRemaining = parentStock == null ? Infinity : Math.max(0, parentStock);

        // component constraints
        let limitingReason = null;
        let maxByComponents = Infinity;

        for (const featVal of selectedFeatures) {
        const meta = getFeatureMeta(featVal);
        const compRaw = meta?.component?.stock;
        const compStock = typeof compRaw === "number" ? compRaw : Number(compRaw);
        if (!Number.isFinite(compStock)) continue;

        const alreadyUsing = inCartQtyForFeature(featVal);
        const compRemaining = Math.max(0, compStock - alreadyUsing);

        if (compRemaining < maxByComponents) {
            maxByComponents = compRemaining;
            limitingReason = compRemaining === 0 ? `${meta?.label || featVal}` : limitingReason;
        }
        }

        const maxAddable = Math.min(parentRemaining, maxByComponents);
        if (maxAddable <= 0) {
        const reason = limitingReason
            ? `${limitingReason} is out of stock`
            : parentStock === 0 || parentRemaining === 0
            ? "This variant is out of stock"
            : "Out of stock";

        showToast(
            "error",
            {
                icon: <XCircle size={18} />,
                title: "Cannot add to cart",
                description: reason,
                action: { label: "View cart", to: "/cart" }, // ← button in toast
            },
            { duration: 3500 }
        );
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
        productId: product.id,
        };

        addToCartToast(adapted);
        onAddToCart?.(adapted);

        if (addQty < incomingQty) {
        const hit = maxAddable === parentRemaining ? "collar variant stock" : "feature stock";
        showToast(
            "warn", 
            { icon: <AlertTriangle size={18} />, 
            title: "Stock limit applied", 
            description: `Only ${maxAddable} available based on ${hit}.` ,
            action: { label: "View cart", to: "/cart" },
        }, { duration: 3500 });
        }
    };

    const handleAddToFavorite = () => {
        if (!ok) return;
        addFavWithToast({
        productId: product.id,
        name: product.name,
        imageUrl: product.images?.[0],
        price: price ?? product.basePrice ?? product.price ?? 0,
        config: cfg,
        tags: product.tags ?? [],
        });
    };

    return (
        <footer className="flex gap-3">
        <button
            onClick={requireLogin(() => handleAddToCart())}
            disabled={!ok || currentStock === 0}
            className="rounded-xl px-4 py-2 border bg-primary text-primary-foreground hover:cursor-pointer hover:border-primary-foreground disabled:opacity-50"
            type="button"
        >
            Add to Cart
        </button>
        <button
            onClick={requireLogin(() => handleAddToFavorite())}
            className="rounded-xl px-4 py-2 border hover:cursor-pointer hover:border-primary-foreground"
            type="button"
        >
            Add to Favorite
        </button>
        </footer>
    );
}
