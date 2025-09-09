import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const DEFAULT_OPTIONS = [
    { id: "standard", label: "Standard", eta: "2–4 days", fee: 0 },
    { id: "express", label: "Express", eta: "1–2 days", fee: 79 },
    { id: "same-day", label: "Same-day (Metro only)", eta: "Today", fee: 149 },
];

export default function CheckoutShippingOptions({ value, onChange, options = DEFAULT_OPTIONS }) {
    const current = value?.id || options[0].id;

    return (
        <Card className="border">
        <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl">Delivery Options</CardTitle>
        </CardHeader>
        <CardContent>
            <RadioGroup
            value={current}
            onValueChange={(val) => {
                const picked = options.find((o) => o.id === val);
                onChange?.(picked);
            }}
            className="grid gap-3"
            >
            {options.map((o) => (
                <Label
                key={o.id}
                htmlFor={`ship-${o.id}`}
                className="flex items-center justify-between rounded-xl border p-3 cursor-pointer"
                >
                <div className="flex items-center gap-3">
                    <RadioGroupItem id={`ship-${o.id}`} value={o.id} />
                    <div>
                    <div className="font-medium">{o.label}</div>
                    <div className="text-xs text-muted-foreground">ETA {o.eta}</div>
                    </div>
                </div>
                <div className="text-sm font-medium">{o.fee === 0 ? "Free" : `฿${o.fee}`}</div>
                </Label>
            ))}
            </RadioGroup>
        </CardContent>
        </Card>
    );
}
