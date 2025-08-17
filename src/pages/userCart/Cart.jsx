import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";
import OrderSummaryBar from "./OrderSummaryBar";

export default function Cart() {
  return (
    <section>
      <div className="text-center py-4">
        <h1 className="text-3xl font-semibold text-onSecondary">
          Cart and Order Confirmation
        </h1>
      </div>

      {/* Order Summary Bar */}
      <OrderSummaryBar />;

      {/* CartIem + Desktop Order Summary */}
      <section className="mt-4 md:flex md:items-center md:flex-row">
         <div className="md:w-[60%] mt-6">
            <CartItem/>
         </div>
        <div className="md:w-[40%] mt-6 hidden md:block">
            <OrderSummary/>
        </div>
      </section>

       {/* Mobile OrderSummary */}
      <section className="md:hidden mt-6">
        <OrderSummary/>
      </section>
    </section>
  );
}
