import { SAMPLE_COLLAR } from '@/lib/productOptions'
import ProductDetail from './productDetail'

const ProductDetailRoute = () => {
    return (
        <ProductDetail 
        product={SAMPLE_COLLAR}
        onAddToCart={(item) => console.log("Add", item)}
        onSavePreset={(qs) => console.log("Preset", qs)}
        />
    );
}

export default ProductDetailRoute