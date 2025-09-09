import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CardPaymentMethod from "@/components/payment-method-01";

export default function CheckoutPaymentMethod({
    value,
    onChange,
    onDetailsChange,
    onValidityChange,
    }) {
    return (
        <Card className="border">
        <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl">Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">
            Mock for now. Choose a method to proceed.
            </p>
            <CardPaymentMethod
            value={value}
            onChange={onChange}
            onDetailsChange={onDetailsChange}
            onValidityChange={onValidityChange}
            />
        </CardContent>
        </Card>
    );
}
