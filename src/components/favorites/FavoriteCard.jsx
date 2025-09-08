import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/lib/favorites";      // or "@/stores/favorites"
import { formatTHB } from "@/lib/formatters";
import { useState } from "react";
import { useAddToCartToast } from "@/hooks/useAddToCartToast"; // ⬅️ NEW

const FALLBACK_IMG = "/images/placeholder-product.png";

export function FavoriteCard({ item }) {
    const navigate = useNavigate();
    const { removeFavorite } = useFavorites();
    const [adding, setAdding] = useState(false);

    // If parent passed addToCart, the hook will use it; otherwise it falls back to CartContext.addItem
    const addToCartToast = useAddToCartToast();

    const { id: favoriteId, productId, name, imageUrl, price, config = {}, tags = [] } = item;
    const imgSrc = imageUrl || FALLBACK_IMG;

    const handleAddFromFav = async () => {
        try {
        setAdding(true);
        // Normalize to the cart item shape expected by your cart
        addToCartToast({
            id: productId ?? favoriteId, // prefer productId as the SKU/cart id
            name,
            imageUrl: imgSrc,
            unitPrice: price,
            quantity: 1,
            config,
        });
        // Optional: remove from favorites after adding to cart (classic “move to cart” behavior)
        // If you want to keep it in favorites, just delete this line.
        removeFavorite(favoriteId);
        } finally {
        setAdding(false);
        }
    };

    return (
        <Card
        className="
            w-full h-full overflow-hidden rounded-2xl
            flex flex-col md:flex-row
        "
        >
        {/* IMAGE */}
        <div
            className="
            bg-white ring-1 ring-border
            relative aspect-[4/3] md:aspect-auto md:w-48 md:h-40
            shrink-0
            "
        >
            <img
            src={imgSrc}
            alt={name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain p-2"
            onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
            />
        </div>

        {/* BODY */}
        <div className="flex min-w-0 flex-1 p-3 md:p-4">
            <div className="flex w-full flex-col gap-2">
            <h3 className="line-clamp-2 text-base font-medium">{name}</h3>

            <div className="text-sm font-medium">{formatTHB(price)}</div>

            {/* Config summary */}
            {Object.keys(config).length > 0 && (
                <p className="line-clamp-2 text-xs text-muted-foreground">
                {Object.entries(config).map(([k, v]) => (
                    <span key={k} className="mr-3">
                    <span className="text-foreground/70">{k}:</span>{" "}
                    {Array.isArray(v) ? v.join(", ") : String(v)}
                    </span>
                ))}
                </p>
            )}

            {/* Tags (optional) */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                {tags.slice(0, 4).map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">
                    {t}
                    </Badge>
                ))}
                </div>
            )}

            {/* ACTIONS — stack on mobile, inline on desktop */}
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                    navigate(`/products/${productId}`, { state: { preset: config } })
                }
                className="sm:w-auto"
                >
                <Eye className="mr-2 h-4 w-4" /> View detail
                </Button>

                <Button
                size="sm"
                onClick={handleAddFromFav}
                disabled={adding}
                className="sm:w-auto"
                >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {adding ? "Adding..." : "Add to cart"}
                </Button>

                <Button
                size="sm"
                variant="destructive"
                onClick={() => removeFavorite(favoriteId)}
                className="sm:ml-auto sm:w-auto"
                >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
            </div>
            </div>
        </div>
        </Card>
    );
}
