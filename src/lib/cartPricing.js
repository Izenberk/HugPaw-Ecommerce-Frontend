export const getUnitPrice = (it) => {
    if (typeof it?.unitPrice === "number") return it.unitPrice;
    if (typeof it?.price === "number") return it.price;
    if (typeof it?.basePrice === "number") return it.basePrice;
    return 0;
};

export const getLineTotal = (it) => {
    const q = Math.max(1, it?.quantity || 1);
    return getUnitPrice(it) * q;
};

export const getSubtotal = (items = []) =>
    items.reduce((sum, it) => sum + getLineTotal(it), 0);
