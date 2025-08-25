import { SAMPLE_COLLAR } from "@/lib/productOptions";
import ProductDetail from "./productDetail";
import { CartProvider, useCart } from "../userCart/CartContext";

function ProductDetailWithCart() {
  const { addItem } = useCart();
  return (
    <ProductDetail
      product={SAMPLE_COLLAR}
      onAddToCart={(item) => {
        console.log("[ProductDetailRoute] add:", item);
        addItem(item);
      }}
      onSavePreset={(qs) => console.log("Preset", qs)}
    />
  );
}


const ProductDetailRoute = () => {
  return <ProductDetailWithCart />;
};

// const ProductDetailRoute = () => {
//   return (
//     <ProductDetail
//       product={SAMPLE_COLLAR}
//       onAddToCart={(item) => console.log("Add", item)}
//       onSavePreset={(qs) => console.log("Preset", qs)}
//     />
//   );
// };

export default ProductDetailRoute;

