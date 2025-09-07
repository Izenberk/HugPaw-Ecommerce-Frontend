/* eslint-disable react-refresh/only-export-components */
import ProductCustom from '../components/productDetail/ProductCustom.jsx'
import { productById } from '@/data/productById';
import { redirect, useLoaderData } from 'react-router-dom';
import { CartProvider, useCart } from "../context/CartContext.jsx";


export async function productLoader({ params }) {
    const product = productById(params.id);
    if (!product) throw redirect("/404");

    return product;
}

function ProductCustomWithCart() {
    const { addItem } = useCart();
    const product = useLoaderData();

    return (
        <ProductCustom
        product={product}
        onAddToCart={(item) => {
            addItem(item);
        }}
        />
    );
}
const ProductCustomPage = () => {
    return <ProductCustomWithCart />
}

export default ProductCustomPage