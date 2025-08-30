// src/hooks/useAddToCartToast.js
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/pages/userCart/CartContext";

// Optional onAdd lets components inject their own add-to-cart behavior.
export function useAddToCartToast({ onAdd } = {}) {
    const { addItem } = useCart();
    const navigate = useNavigate();

    return (raw) => {
        // normalize image field
        const image = raw.image ?? raw.imageUrl ?? raw.thumbnailUrl;
        const item = { ...raw, image };

        if (onAdd) onAdd(item);
        else addItem(item);

        toast.success("Added to cart", {
        description: item.name,
        action: { label: "View cart", onClick: () => navigate("/cart") },
        duration: 2500,
        // keep your custom colors if you want
        style: {
            background: "var(--success)",
            color: "var(--popover-foreground)",
            border: "var(--border)",
        },
        });
    };
}
