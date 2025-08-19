/* eslint-disable react-refresh/only-export-components */
import ProductDetail from './productDetail'
import { productById } from '@/data/productById';
import { redirect, useLoaderData } from 'react-router-dom';

export async function productLoader({ params }) {
    const product = productById(params.id);
    if (!product) throw redirect("/404");

    return product;
}

const ProductDetailRoute = () => {
    const product = useLoaderData();

    return (
        <ProductDetail 
        product={product}
        onAddToCart={(item) => console.log("Add", item)}
        onSavePreset={(qs) => console.log("Preset", qs)}
        />
    );
}

export default ProductDetailRoute