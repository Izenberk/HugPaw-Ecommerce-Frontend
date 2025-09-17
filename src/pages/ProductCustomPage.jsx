/* eslint-disable react-refresh/only-export-components */
import ProductCustom from "@/components/productCustom";
import { productById } from "@/data/productById";
import { redirect, useLoaderData } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/lib/favorites"; // ✅ zustand store

export async function productLoader({ params }) {
    const product = productById(params.id);
    if (!product) throw redirect("/404");
    return product;
}

function ProductCustomWithCart() {
    const product = useLoaderData();
    const { addItem } = useCart();
    const { addFavorite } = useFavorites();

    return (
        <ProductCustom
            product={product}
            onAddToCart={(item) => addItem(item)}
            onAddToFavorite={(fav) => addFavorite(fav)}
        />
    );
}

export default function ProductCustomPage() {
    return <ProductCustomWithCart />;
}