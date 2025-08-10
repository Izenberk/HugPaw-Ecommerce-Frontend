import ProductCatalog from './ProductCatalog'
import { PRODUCTS_MOCK } from '@/data/products.mock'

const ProductRoute = () => {
    return <ProductCatalog initialProducts={PRODUCTS_MOCK} />
}

export default ProductRoute