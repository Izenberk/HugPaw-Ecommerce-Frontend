import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutUserDetails from "@/components/checkout/CheckoutUserDetails";
import CheckoutShippingOptions from "@/components/checkout/CheckoutShippingOptions";
import CheckoutOrderReview from "@/components/checkout/CheckoutOrderReview";
import CheckoutPaymentMethod from "@/components/checkout/CheckoutPaymentMethod";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import { useCart } from "@/context/CartContext"; // adjust name/path if needed
import { formatTHB } from "@/lib/formatters"; // used inside children too
import { useUser } from "@/context/UserContext";
import { appendOrder } from "@/lib/orderStorage";
import ReceiptModal from "@/components/checkout/ReceiptModal";
import { computeCartTotals } from "@/lib/cartTotals";
import { showToast } from "@/lib/toast";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart, appliedCode } = useCart();

  const [receiptOpen, setReceiptOpen] = useState(false);
  const [recentOrder, setRecentOrder] = useState(null);

  // 1) User details form state
  const [userInfo, setUserInfo] = useState(null);
  const { user } = useUser();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentValid, setPaymentValid] = useState(false);

  // Prefill from user profile (runs once when user loads)
  useEffect(() => {
    if (!user) return;
    setUserInfo({
      fullName: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      line1: user.address?.line1 || "",
      line2: user.address?.line2 || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      postal: user.address?.postal || "",
      country: user.address?.country || "",
    });
  }, [user]);

  // 2) Shipping selection
  const [shipping, setShipping] = useState({
    id: "standard",
    label: "Standard",
    eta: "2–4 days",
    fee: 0,
  });

  // 3) Purchase time (set by mock payment)
  const [purchaseTime, setPurchaseTime] = useState(null);

  // Tax/discount (placeholder formulas)
  const discount = 0;
  const tax = 0;

  const canConfirm =
    !!userInfo?.fullName &&
    !!userInfo?.email &&
    !!userInfo?.line1 &&
    !!userInfo?.city &&
    !!userInfo?.postal &&
    !!userInfo?.country &&
    !!shipping?.id &&
    items.length > 0 &&
    (paymentMethod !== "card" || paymentValid);

  const handleConfirmPay = useCallback(() => {
    // 0) Guardrails: contact & shipping
    if (
      !userInfo?.fullName ||
      !userInfo?.email ||
      !userInfo?.line1 ||
      !userInfo?.city ||
      !userInfo?.postal ||
      !userInfo?.country
    ) {
      // alert("Please complete your contact & shipping address.");
      showToast(
        "alert",
        {
          title: "Please complete your contact & shipping address.",
          onAction: () => navigate("/login"),
        },
        { duration: 2000 }
      );
      return;
    }
    if (!shipping?.id) {
      // alert("Please select a shipping option.");
      showToast(
        "alert",
        {
          title: "Please select a shipping option.",
          onAction: () => navigate("/login"),
        },
        { duration: 2000 }
      );
      return;
    }
    if (!items || items.length === 0) {
      // alert("Your cart is empty.");
      showToast(
        "alert",
        {
          title: "Your cart is empty.",
          onAction: () => navigate("/login"),
        },
        { duration: 2000 }
      );
      return;
    }

    // 1) Payment validation
    if (paymentMethod === "card" && !paymentValid) {
      // alert("Please complete valid card details.");
      showToast(
        "alert",
        {
          title: "Please complete valid card details.",
          onAction: () => navigate("/login"),
        },
        { duration: 2000 }
      );
      return;
    }

    // 2) Snapshot time
    const now = new Date();
    const ts = now.toISOString();
    setPurchaseTime(ts);

    // 3) Authoritative totals (same as CheckoutSummary)
    const totals = computeCartTotals(items, {
      appliedCode, // promo: "happyhugpaw"
      shippingMethod: shipping, // radio-selected method
      includeShipping: true,
      taxRate: 0,
    });
    const {
      subtotal: subCalc,
      discount: baseDiscount,
      promoDiscount,
      shippingFee,
      tax: taxCalc,
      total,
    } = totals;

    // Helper: safely get unit price per line
    const unit = (it) =>
      typeof it.unitPrice === "number"
        ? it.unitPrice
        : typeof it.price === "number"
        ? it.price
        : typeof it.basePrice === "number"
        ? it.basePrice
        : 0;

    // 4) Build mock order object (what you'd POST to /orders later)
    const orderId = `ord_${Date.now()}`;
    const order = {
      id: orderId,
      status: "paid", // mock: treat as paid
      placedAt: ts,
      user: {
        fullName: userInfo.fullName,
        email: userInfo.email,
        phone: userInfo.phone || "",
      },
      shipping: {
        methodId: shipping.id,
        methodLabel: shipping.label,
        fee: shippingFee,
        address: {
          line1: userInfo.line1,
          line2: userInfo.line2 || "",
          city: userInfo.city,
          state: userInfo.state || "",
          postal: userInfo.postal,
          country: userInfo.country,
        },
      },
      payment: {
        method: paymentMethod,
        ...(paymentMethod === "card"
          ? { cardLast4: paymentDetails?.card?.number?.slice?.(-4) ?? null }
          : {}),
      },
      items: items.map((it) => ({
        productId: it.productId,
        name: it.name,
        quantity: it.quantity || 1,
        // prefer unitPrice stored in cart; fallback to legacy fields
        unitPrice: Number(it.unitPrice ?? it.price ?? it.basePrice ?? 0),
        config: it.config || {},
        imageUrl: it.imageUrl || null,
      })),
      amounts: {
        // snapshot the exact figures the UI showed
        subtotal: subCalc,
        discount: baseDiscount,
        promoDiscount, // keep promo separate for transparency
        shippingFee,
        tax: taxCalc,
        total,
      },
    };

    // 5) Persist mock order, clear cart, and open receipt modal
    const savedId = appendOrder(order);
    setRecentOrder(order);
    clearCart();
    setReceiptOpen(true);

    // 6) Clear cart (expects CartContext to expose clearCart)
    try {
      clearCart?.(); // if your CartContext provides it
    } catch {
      // fallback so you don't get stuck during testing
      localStorage.setItem("cartItems", "[]");
    }

    // // 7) Navigate to success page
    // navigate(`/orders/success/${orderId}`);
  }, [
    userInfo,
    shipping,
    items,
    appliedCode,
    paymentMethod,
    paymentValid,
    paymentDetails,
    setPurchaseTime,
    clearCart,
  ]);

  return (
    <section className="min-h-screen">
      <header className="py-6 md:py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Checkout
          </h1>
          <p className="text-muted-foreground mt-1">
            Review details, pick shipping, then pay. Subtotal:{" "}
            {formatTHB(subtotal)}
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: 1) details 2) shipping 3) review 4) payment */}
          <section className="lg:col-span-7 space-y-6">
            <CheckoutUserDetails value={userInfo} onChange={setUserInfo} />
            <CheckoutShippingOptions value={shipping} onChange={setShipping} />
            <CheckoutOrderReview />
            <CheckoutPaymentMethod
              value={paymentMethod}
              onChange={setPaymentMethod}
              onDetailsChange={setPaymentDetails}
              onValidityChange={setPaymentValid}
            />
          </section>

          {/* RIGHT: 5) summary */}
          <aside className="lg:col-span-5">
            <CheckoutSummary
              shippingMethod={shipping} // ⟵ key change
              onConfirmPay={handleConfirmPay}
              disabled={!canConfirm}
              onBackToCart={() => navigate("/cart")}
            />
          </aside>
        </div>
      </main>
      <ReceiptModal
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        order={recentOrder}
        onContinue={() => {
          setReceiptOpen(false);
          navigate("/catalog");
        }}
      />
    </section>
  );
}
