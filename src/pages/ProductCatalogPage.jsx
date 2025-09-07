import ProductCatalog from '@components/products/ProductCatalog'
import { PRODUCTS_MOCK } from '@/data/productsCatalog.mock'

const ProductCatalogPage = () => {
    return <ProductCatalog initialProducts={PRODUCTS_MOCK} />
}

export default ProductCatalogPage