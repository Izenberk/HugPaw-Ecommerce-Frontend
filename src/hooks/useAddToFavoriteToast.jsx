import { useNavigate } from "react-router-dom";
import { showToast } from "@/lib/toast";

export function useAddToFavoriteToast({ onAdd } = {}) {
  // If you prefer context instead of onAdd injection:
  // const { addFavorite } = useFavorites();

  const navigate = useNavigate();

  return (raw) => {
    // Normalize fields
    const image = raw.image ?? raw.imageUrl ?? raw.thumbnailUrl;
    const item = { ...raw, image };

    // Add to favorites
    if (onAdd) onAdd(item);
    // else addFavorite(item); // <- if you use a favorites context, uncomment

    showToast(
      "fav",
      {
        title: "Added to wishlist",
        description: item.name,
        image: item.image,
        actionLabel: "View wishlist",
        onAction: () => navigate("/user"),
      },
      { duration: 2000 }
    );
  };
}
