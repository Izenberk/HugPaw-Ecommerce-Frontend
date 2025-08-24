/* eslint-disable react-refresh/only-export-components */
import ProductDetail from './ProductDetail.jsx'
import { productById } from '@/data/productById';
import { redirect, useLoaderData } from 'react-router-dom';
import { CartProvider, useCart } from "../userCart/CartContext";


export async function productLoader({ params }) {
    const product = productById(params.id);
    if (!product) throw redirect("/404");

    return product;
}
function ProductDetailWithCart() {
    const { addItem } = useCart();
    const product = useLoaderData();

    return (
        <ProductDetail
        product={product}
        onAddToCart={(item) => {
            console.log("[ProductDetailRoute] add:", item);
            addItem(item);
        }}
        onSavePreset={(qs) => console.log("Preset", qs)}
        />
    );
}
const ProductDetailRoute = () => {
    return <ProductDetailWithCart />
}

export default ProductDetailRoute