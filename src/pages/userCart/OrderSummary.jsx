import { Link } from "react-router-dom";
import { useCart } from "../userCart/CartContext";
import { useEffect, useState } from "react";

export default function OrderSummary({
  showCheckoutBtn = true,
  showPromo = true,
}) {
  const { subtotal, promoCode, setPromoCode, appliedCode, setAppliedCode } = useCart();


  const [promoMsg, setPromoMsg] = useState("");

  const promoDiscount = appliedCode.trim().toLowerCase() === "happyhugpaw" ? subtotal * 0.05 : 0;

  const discount = subtotal > 3000 ? subtotal * 0.1 : 0;
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal - discount - promoDiscount + shipping;

  const handleApply = () => {
    const normalized = promoCode.trim().toLowerCase();

    if (normalized === "happyhugpaw".toLowerCase()) {
      setAppliedCode("happyhugpaw");

      setPromoMsg("🎉 Promo applied: HappyHugPaw (5% off)");
    } else {
      
      setPromoMsg("❌ Invalid promo code");
    }
  };



  return (
    <div className="bg-surface border rounded-lg shadow space-y-4 p-4 max-w-xl mx-auto">
      {/* Promo code */}
      {showPromo && (
        <div>
          <div className="flex justify-between gap-2">
            <input
              type="text"
              placeholder="Enter promo code here"
              className="flex-1 border px-3 py-2 rounded"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button
              onClick={handleApply}
              disabled={!promoCode.trim()}
              className={`px-4 py-2 rounded hover:bg-primaryHover font-semibold
          ${
            !promoCode.trim()
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-primary text-onPrimary hover:bg-primaryHover cursor-pointer"
          }`}
            >
              Apply
            </button>
          </div>
          {promoMsg && (
            <p
              className={`text-sm mt-1 ${
                promoMsg.startsWith("❌")
                  ? "text-red-600 font-semibold"
                  : "text-green-600 font-semibold "
              }`}
            >
              {promoMsg}
            </p>
          )}
        </div>
      )}



      {/* Summary */}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-onPrimary">
          <span>Sub Total</span>
          <span>฿{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-onPrimary">
          <div className="flex gap-2">
            Discount
            {subtotal > 3000 && (
              <p className="text-onPrimary font-semibold">
                🎉 You got 10% discount!
              </p>
            )}
          </div>
          <div>
            -฿
            {discount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>

         {/* Promo code discount */}
        {appliedCode === "happyhugpaw" &&  (
          <div className="flex justify-between text-onPrimary font-semibold">
            <span>Promo (HappyHugPaw 5% off)</span>
            <span>
              -฿
              {promoDiscount.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        )}


        <div className="flex justify-between text-onPrimary">
          <span>Shipping</span>
          <span>฿{shipping.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-semibold text-onPrimary">
          <span>Total</span>
          <span>
            ฿{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
      {/* Checkout */}
      {showCheckoutBtn && (
        <Link
          to="checkout"
          className="block text-center w-full bg-primary text-onPrimary py-3 rounded-lg shadow hover:bg-primaryHover font-semibold"
        >
          Checkout
        </Link>
      )}
    </div>
  );
}
