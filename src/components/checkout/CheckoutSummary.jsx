import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatTHB } from "@/lib/formatters";

export default function CheckoutSummary({
    subtotal = 0,
    shippingFee = 0,
    discount = 0,
    tax = 0,
    onConfirmPay,
    onBackToCart,
    }) {
    const total = Math.max(0, subtotal + shippingFee + tax - discount);

    return (
        <div className="lg:sticky lg:top-6">
        <Card className="border">
            <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
            <Row label="Subtotal" value={formatTHB(subtotal)} />
            <Row label="Shipping" value={shippingFee === 0 ? "Free" : formatTHB(shippingFee)} />
            {discount > 0 && <Row label="Discount" value={`- ${formatTHB(discount)}`} />}
            {tax > 0 && <Row label="Tax" value={formatTHB(tax)} />}

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
