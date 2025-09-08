import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { showToast } from "@/lib/toast";

export function useAddToCartToast({ onAdd } = {}) {
    const { addItem } = useCart();
    const navigate = useNavigate();

    return (raw) => {
        // Normalize product fields
        const image = raw.image ?? raw.imageUrl ?? raw.thumbnailUrl;
        const item = { ...raw, image };

        if (onAdd) onAdd(item);
        else addItem(item);

        showToast("success", {
            title: "Added to cart",
            description: item.name,
            image: item.image,
            actionLabel: "View cart",
            onAction: () => navigate("/cart"),
        });
    };
}
