import { useFavorites } from "@/lib/favorites";
import { Heart } from "lucide-react";
import { FavoriteCard } from "./FavoriteCard";
import { Button } from "../ui/button";
import { useCart } from "@/context/CartContext";

export default function FavoritePanel() {
    const { items, clearFavorites } = useFavorites();
    const { addItem } = useCart();

    if (!items?.length) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border p-8 text-center">
                <Heart className="mb-2 h-8 w-8" />
                <p className="text-sm text-muted-foreground">No favorites yet. Go heart some gear for your floof.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Favorites</h2>
                <Button variant="outline" size="sm" onClick={clearFavorites}>Clear all</Button>
            </div>
            <div className="flex flex-col gap-4 md:gap-6">
                {items.map((it) => (
                    <FavoriteCard key={it.id} item={it} addToCart={addItem} />
                ))}
            </div>
        </div>
    );
}