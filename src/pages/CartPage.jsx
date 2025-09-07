// /src/pages/userCart/Cart.jsx
import CartItem from "../components/userCart/CartItem";
import OrderSummary from "../components/userCart/OrderSummary";
import OrderSummaryBar from "../components/userCart/OrderSummaryBar";
import { useCart } from "@/context/CartContext.jsx";

export default function CartPage() {
  const { items } = useCart();

  return (
    <section>
      <div className="text-center py-4">
        <h1 className="text-3xl font-semibold text-onSecondary">
          Cart and Order Confirmation
        </h1>
      </div>

      {/* Order Summary Bar */}
      <OrderSummaryBar />

      {/* Cart Items + Desktop Order Summary */}
      <section className="mt-4 md:flex md:items-start md:flex-row gap-6">
        <div className="md:w-[60%] ">
          <div className="overflow-y-scroll md:h-120 h-75 pt-4 bg-surface border rounded-lg shadow">
            {items.length === 0 ? (
              <div className="w-[80%] max-w-4xl mx-auto p-4 text-center text-muted-foreground">
                Your cart is empty
              </div>
            ) : (
              items.map((it) => (
                <CartItem
                  key={it.productId + JSON.stringify(it.config || {})}
                  item={it}
                />
              ))
            )}
          </div>
        </div>

        <div className="md:w-[40%] mt-6 hidden md:block">
          <OrderSummary />
        </div>
      </section>

      {/* Mobile OrderSummary */}
      <section className="md:hidden mt-6">
        <OrderSummary />
      </section>
    </section>
  );
}
