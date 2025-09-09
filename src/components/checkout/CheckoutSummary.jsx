// /src/pages/checkout/CheckoutSummary.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatTHB } from "@/lib/formatters";
import { useCart } from "@/context/CartContext";
import { computeCartTotals } from "@/lib/cartTotals";

export default function CheckoutSummary({
    shippingMethod,     // { id, label, fee } chosen in checkout
    onConfirmPay,
    onBackToCart,
    }) {
    const { items, appliedCode } = useCart();

    // Authoritative numbers (same rules as OrderSummary, but apply shipping here)
    const { subtotal, discount, promoDiscount, shippingFee, total } =
        computeCartTotals(items, {
        appliedCode,        // enables promo 5%
        shippingMethod,     // include chosen shipping
        includeShipping: true,
        taxRate: 0,
        });

    return (
        <div className="lg:sticky lg:top-6">
        <Card className="border">
            <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl">Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
            <Row label="Subtotal" value={formatTHB(subtotal)} />
            <Row label="Shipping" value={shippingFee === 0 ? "Free" : formatTHB(shippingFee)} />

            {discount > 0 && (
                <Row label="Discount (10%)" value={`- ${formatTHB(discount)}`} />
            )}
            {promoDiscount > 0 && (
                <Row label="Promo (HappyHugPaw 5%)" value={`- ${formatTHB(promoDiscount)}`} />
            )}

            <Separator />

            <Row
                label={<span className="font-semibold">Total</span>}
                value={<span className="font-semibold">{formatTHB(total)}</span>}
            />

            <Button
                type="button"
                size="lg"
                className="w-full mt-2"
                onClick={() => onConfirmPay?.()}
                data-testid="confirm-pay-btn"
            >
                Confirm &amp; Pay
            </Button>
            <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => onBackToCart?.()}
                data-testid="back-to-cart-btn"
            >
                Back to Cart
            </Button>

            <p className="text-xs text-muted-foreground mt-2">
                By confirming, you agree to our Terms and Refund Policy.
            </p>
            </CardContent>
        </Card>
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground">{label}</div>
        <div>{value}</div>
        </div>
    );
}
