import { Link } from "react-router-dom";
import { getOrders } from "@/lib/orderStorage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatTHB } from "@/lib/formatters";

export default function OrdersHistory() {
    const orders = getOrders();

    return (
        <div className="container mx-auto px-4 py-12">
        <Card>
            <CardHeader>
            <CardTitle>My Orders</CardTitle>
            </CardHeader>
            <CardContent>
            {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Placed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((o) => (
                    <TableRow key={o.id}>
                        <TableCell>
                        <Link className="underline" to={`/orders/success/${o.id}`}>{o.id}</Link>
                        </TableCell>
                        <TableCell>{new Date(o.placedAt).toLocaleString()}</TableCell>
                        <TableCell>{o.status}</TableCell>
                        <TableCell className="text-right">{formatTHB(o.amounts.total)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
            </CardContent>
        </Card>
        </div>
    );
}
