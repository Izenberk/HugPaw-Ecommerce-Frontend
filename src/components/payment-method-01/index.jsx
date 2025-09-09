import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "./icons";

/**
 * Props:
 * - value?: "card" | "paypal" | "apple"
 * - onChange?: (methodId: string) => void
 * - onDetailsChange?: (payload: { method, card? }) => void
 * - onValidityChange?: (ok: boolean) => void
 */
export default function CardPaymentMethod({
  value = "card",
  onChange,
  onDetailsChange,
  onValidityChange,
}) {
  const [method, setMethod] = useState(value);
  const [cardName, setCardName] = useState("");
  const [city, setCity] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvc, setCvc] = useState("");

  useEffect(() => setMethod(value), [value]);

  const digitsOnly = (s) => s.replace(/\D/g, "");
  const luhn = (numStr) => {
    const s = digitsOnly(numStr);
    if (s.length < 13 || s.length > 19) return false;
    let sum = 0, alt = false;
    for (let i = s.length - 1; i >= 0; i--) {
      let n = +s[i];
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n; alt = !alt;
    }
    return sum % 10 === 0;
  };

  const cardValid = useMemo(() => {
    if (method !== "card") return true; // non-card methods need no extra fields
    const year = +expYear, month = +expMonth;
    const now = new Date();
    const yOk = Number.isFinite(year) && year >= now.getFullYear();
    const mOk = Number.isFinite(month) && month >= 1 && month <= 12 &&
      (year > now.getFullYear() || month >= (now.getMonth() + 1));
    const nOk = luhn(cardNumber);
    const nameOk = cardName.trim().length >= 2;
    const cvcOk = /^\d{3,4}$/.test(digitsOnly(cvc));
    const cityOk = city.trim().length >= 2;
    return yOk && mOk && nOk && nameOk && cvcOk && cityOk;
  }, [method, cardName, city, cardNumber, expMonth, expYear, cvc]);

  // Bubble up both details and validity
  useEffect(() => {
    onDetailsChange?.({
      method,
      card: method === "card" ? {
        name: cardName,
        number: digitsOnly(cardNumber),
        expMonth: expMonth,
        expYear: expYear,
        cvc: digitsOnly(cvc),
        city,
      } : undefined,
    });
  }, [method, cardName, city, cardNumber, expMonth, expYear, cvc, onDetailsChange]);

  useEffect(() => {
    onValidityChange?.(cardValid);
  }, [cardValid, onValidityChange]);

  const handleMethodChange = (val) => {
    setMethod(val);
    onChange?.(val);
  };

  return (
    <Card className="w-full md:w-[80%]">
      <CardHeader className="text-center">
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Select how you want to pay.</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        <RadioGroup value={method} onValueChange={handleMethodChange} className="grid grid-cols-3 gap-4">
          <Choice id="pm-card" value="card" icon={<Icons.card className="mb-3 size-6" />} label="Card" />
          <Choice id="pm-paypal" value="paypal" icon={<Icons.paypal className="mb-3 size-6" />} label="Paypal" />
          <Choice id="pm-apple" value="apple" icon={<Icons.apple className="mb-3 size-6" />} label="Apple" />
        </RadioGroup>

        {method === "card" && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="card-name">Name on the card</Label>
              <Input id="card-name" value={cardName} onChange={(e) => setCardName(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="card-city">City</Label>
              <Input id="card-city" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="card-number">Card number</Label>
              <Input
                id="card-number"
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="0000 0000 0000 0000"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="card-month">Expires</Label>
                <Select value={expMonth} onValueChange={setExpMonth}>
                  <SelectTrigger className="w-full" id="card-month" aria-label="Month">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const m = `${i + 1}`;
                      return (
                        <SelectItem key={m} value={m}>
                          {new Date(0, i).toLocaleString(undefined, { month: "long" })}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="card-year">Year</Label>
                <Select value={expYear} onValueChange={setExpYear}>
                  <SelectTrigger className="w-full" id="card-year" aria-label="Year">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const y = `${new Date().getFullYear() + i}`;
                      return <SelectItem key={y} value={y}>{y}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="card-cvc">CVC</Label>
                <Input
                  id="card-cvc"
                  inputMode="numeric"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="CVC"
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Choice({ id, value, icon, label }) {
  return (
    <div>
      <RadioGroupItem value={value} id={id} className="peer sr-only" aria-label={label} />
      <Label
        htmlFor={id}
        className="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary flex flex-col items-center justify-between rounded-md border-2 bg-transparent p-4"
      >
        {icon}
        {label}
      </Label>
    </div>
  );
}
