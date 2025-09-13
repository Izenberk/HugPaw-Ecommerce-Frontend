// /src/lib/cartTotals.js
const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);

export function computeCartTotals(
    items = [],
    { appliedCode, shippingMethod, includeShipping = true, taxRate = 0 } = {}
    ) {
    const lineItems = items.map((it) => {
        const unit = num(it.unitPrice ?? it.price ?? it.basePrice, 0);
        const qty = num(it.quantity, 1);
        return { ...it, unitPrice: unit, lineTotal: unit * qty };
    });

    const subtotal = lineItems.reduce((a, it) => a + it.lineTotal, 0);

    const discount = subtotal > 3000 ? subtotal * 0.10 : 0;

    const promoDiscount =
        typeof appliedCode === "string" &&
        appliedCode.trim().toLowerCase() === "happyhugpaw"
        ? subtotal * 0.05
        : 0;

    const shippingFee =
        includeShipping && shippingMethod ? num(shippingMethod.fee, 0) : 0;

    const taxable = Math.max(0, subtotal - discount - promoDiscount);
    const tax = +(taxable * num(taxRate, 0)).toFixed(2);
    const total = Math.max(0, subtotal + shippingFee - discount - promoDiscount + tax);

    return { lineItems, subtotal, discount, promoDiscount, shippingFee, tax, total };
}
