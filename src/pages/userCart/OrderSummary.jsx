import { Link } from "react-router-dom";

export default function OrderSummary() {
  return (
    <div className="bg-surface border rounded-lg shadow space-y-4 p-4 max-w-xl mx-auto">
      <div className="flex justify-between gap-2">
        <input
          type="text"
          placeholder="Enter promo code here"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button className="bg-primary text-onPrimary px-4 py-2 rounded hover:bg-primaryHover font-semibold">
          Apply
        </button>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-onPrimary">
          <span>Sub Total</span>
          <span>฿3,049</span>
        </div>
        <div className="flex justify-between text-onPrimary">
          <span>Discount</span>
          <span>-฿300</span>
        </div>
        <div className="flex justify-between text-onPrimary">
          <span>Shipping</span>
          <span>฿50</span>
        </div>
        <div className="flex justify-between font-semibold text-onPrimary">
          <span>Total</span>
          <span>฿2,799</span>
        </div>
      </div>
      <Link
        to="checkout"
        className="block text-center  w-full bg-primary text-onPrimary py-3 rounded-lg shadow hover:bg-primaryHover font-semibold"
      >
        Checkout
      </Link>
    </div>
  );
}
