import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext"; // adjust if your hook is named differently
import { formatTHB } from "@/lib/formatters";   // you already use this elsewhere
import { getUnitPrice, getLineTotal } from "@/lib/cartPricing";

export default function CheckoutOrderReview() {
    const { items = [] } = useCart?.() || { items: [] };

    return (
        <Card className="border">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg md:text-xl">Order Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {items.length === 0 && (
                    <p className="text-sm text-muted-foreground">Your cart is empty.</p>
                )}

                {items.map((it) => {
                    const key = `${it.productId}-${JSON.stringify(it.config || {})}`;
                    const unit = getUnitPrice(it);
                    const line = getLineTotal(it);
                    return (
                        <div key={key} className="flex items-start gap-3">
                        <img
                            src={it.imageUrl || "/images/placeholder-product.png"}
                            alt={it.name}
                            className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                            <div className="font-medium">{it.name}</div>
                            {it.config && (
                            <div className="text-xs text-muted-foreground">
                                {Object.entries(it.config)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" • ")}
                            </div>
                            )}
                            <div className="text-xs text-muted-foreground mt-1">
                            Unit: {formatTHB(unit)} • Qty: {it.quantity || 1}
                            </div>
                        </div>
                        <div className="text-sm font-medium whitespace-nowrap">
                            {formatTHB(line)}
                        </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
