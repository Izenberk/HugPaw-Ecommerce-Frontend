import { useMemo } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getOrderById, getLastOrderId } from "@/lib/orderStorage";
import { formatTHB } from "@/lib/formatters";

export default function OrderSuccess() {
    const { id: idFromParam } = useParams();
    const [sp] = useSearchParams(); // fallback if you ever pass ?id= or ?ts=
    const navigate = useNavigate();

    const orderId = useMemo(() => {
        return idFromParam || sp.get("id") || getLastOrderId();
    }, [idFromParam, sp]);

    const order = useMemo(() => (orderId ? getOrderById(orderId) : null), [orderId]);

    if (!order) {
        return (
        <div className="container mx-auto px-4 py-12">
            <Card>
            <CardHeader>
                <CardTitle>Order not found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p>We couldn’t find that order. It may have been cleared.</p>
                <div className="flex gap-2">
                <Button onClick={() => navigate("/")}>Back to shop</Button>
                <Button variant="ghost" asChild><Link to="/orders">View my orders</Link></Button>
                </div>
            </CardContent>
            </Card>
        </div>
        );
    }

    const { items, amounts, user, shipping, payment, placedAt, status } = order;

    return (
        <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: receipt details */}
            <section className="lg:col-span-8 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Receipt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                <p><span className="text-muted-foreground">Order ID:</span> {order.id}</p>
                <p><span className="text-muted-foreground">Placed:</span> {new Date(placedAt).toLocaleString()}</p>
                <p><span className="text-muted-foreground">Status:</span> {status}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Items</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/2">Product</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead className="text-right">Line total</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {items.map((it, i) => (
                        <TableRow key={i}>
                        <TableCell>
                            <div className="font-medium">{it.name}</div>
                            {it.config && Object.keys(it.config).length > 0 && (
                            <div className="text-xs text-muted-foreground">
                                {Object.entries(it.config).map(([k, v]) => `${k}: ${v}`).join(" • ")}
                            </div>
                            )}
                        </TableCell>
                        <TableCell>{formatTHB(it.unitPrice)}</TableCell>
                        <TableCell>{it.quantity}</TableCell>
                        <TableCell className="text-right">
                            {formatTHB(it.unitPrice * it.quantity)}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                <CardHeader>
                    <CardTitle>Shipping</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    <p>{shipping?.methodLabel} — {shipping?.fee ? formatTHB(shipping.fee) : "Free"}</p>
                    <Separator />
                    <p>{order.shipping?.address?.line1}</p>
                    {order.shipping?.address?.line2 && <p>{order.shipping.address.line2}</p>}
                    <p>
                    {order.shipping?.address?.city}
                    {order.shipping?.address?.state ? `, ${order.shipping.address.state}` : ""}
                    {" "}{order.shipping?.address?.postal}
                    </p>
                    <p>{order.shipping?.address?.country}</p>
                </CardContent>
                </Card>

                <Card>
                <CardHeader>
                    <CardTitle>Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    <p>Method: {payment?.method}</p>
                    {payment?.cardLast4 && <p>Card: **** **** **** {payment.cardLast4}</p>}
                    <p>Payer: {user?.fullName} ({user?.email})</p>
                </CardContent>
                </Card>
            </div>
            </section>

            {/* Right: totals */}
            <aside className="lg:col-span-4">
            <Card className="lg:sticky lg:top-6">
                <CardHeader>
                <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                <Row label="Subtotal" value={formatTHB(amounts.subtotal)} />
                <Row label="Shipping" value={amounts.shippingFee ? formatTHB(amounts.shippingFee) : "Free"} />
                {amounts.discount > 0 && <Row label="Discount" value={`- ${formatTHB(amounts.discount)}`} />}
                {amounts.tax > 0 && <Row label="Tax" value={formatTHB(amounts.tax)} />}
                <Separator className="my-2" />
                <Row
                    label={<span className="font-semibold">Total</span>}
                    value={<span className="font-semibold">{formatTHB(amounts.total)}</span>}
                />

                <div className="flex gap-2 pt-2">
                    <Button asChild><Link to="/">Continue shopping</Link></Button>
                    <Button variant="ghost" asChild><Link to="/orders">View orders</Link></Button>
                </div>
                </CardContent>
            </Card>
            </aside>
        </div>
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
