// /src/components/userCart/OrderSummary.jsx
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { computeCartTotals } from "@/lib/cartTotals";

export default function OrderSummary({
  showCheckoutBtn = true,
  showPromo = true,
}) {
  const { items, promoCode, setPromoCode, appliedCode, setAppliedCode } = useCart();
  const [promoMsg, setPromoMsg] = useState("");

  const { subtotal, discount, promoDiscount, total } = computeCartTotals(items, {
    appliedCode,          // <-- only this controls promo math
    includeShipping: false,
    taxRate: 0,
  });

  const handleApply = () => {
    const normalized = promoCode.trim().toLowerCase();
    if (normalized === "happyhugpaw") {
      setAppliedCode("happyhugpaw");
      setPromoMsg("🎉 Promo applied: HappyHugPaw (5% off)");
    } else {
      setAppliedCode(""); // ensure not applied
      setPromoMsg("❌ Invalid promo code");
    }
    setPromoCode("");
  };

  const handleRemovePromo = () => {
    setAppliedCode("");
    setPromoMsg("Promo removed");
  };

  return (
    <div className="bg-surface border rounded-lg shadow space-y-4 p-4 max-w-xl mx-auto">
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
              className={`px-4 py-2 rounded font-semibold ${
                !promoCode.trim()
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-primary text-onPrimary hover:bg-primaryHover"
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
                  : "text-green-600 font-semibold"
              }`}
            >
              {promoMsg}
            </p>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="space-y-1 text-sm">
        <Row label="Subtotal" value={`฿${subtotal.toLocaleString()}`} />
        <Row
          label={
            <span className="flex gap-2">
              Discount
              {discount > 0 && <span className="font-semibold">🎉 You got 10% discount!</span>}
            </span>
          }
          value={`-฿${discount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
        />
        {promoDiscount > 0 && (
          <div className="flex justify-between text-onPrimary font-semibold">
            <span className="flex items-center gap-2">
              Promo (HappyHugPaw 5% off)
              <button
                type="button"
                className="text-xs underline text-muted-foreground"
                onClick={handleRemovePromo}
              >
                Remove
              </button>
            </span>
            <span>-฿{promoDiscount.toLocaleString(undefined,{ maximumFractionDigits: 2 })}</span>
          </div>
        )}

        <Row label="Shipping" value="Calculated at checkout" />

        <div className="flex justify-between font-semibold text-onPrimary">
          <span>Total</span>
          <span>
            ฿{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

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

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-onPrimary">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
