import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutUserDetails({ value, onChange }) {
    const v = value || {};
    const set = (key) => (e) => onChange({ ...v, [key]: e.target.value });

    return (
        <Card className="border">
        <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl">Contact & Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
            {/* Contact */}
            <div className="grid md:grid-cols-3 gap-4">
            <div>
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" value={v.fullName || ""} onChange={set("fullName")} />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={v.email || ""} onChange={set("email")} />
            </div>
            <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={v.phone || ""} onChange={set("phone")} />
            </div>
            </div>

            {/* Address */}
            <div className="grid md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="line1">Address line 1</Label>
                <Input id="line1" value={v.line1 || ""} onChange={set("line1")} />
            </div>
            <div>
                <Label htmlFor="line2">Address line 2 (optional)</Label>
                <Input id="line2" value={v.line2 || ""} onChange={set("line2")} />
            </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
            <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={v.city || ""} onChange={set("city")} />
            </div>
            <div>
                <Label htmlFor="state">State/Province</Label>
                <Input id="state" value={v.state || ""} onChange={set("state")} />
            </div>
            <div>
                <Label htmlFor="postal">Postal code</Label>
                <Input id="postal" value={v.postal || ""} onChange={set("postal")} />
            </div>
            <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={v.country || ""} onChange={set("country")} />
            </div>
            </div>
        </CardContent>
        </Card>
    );
}
