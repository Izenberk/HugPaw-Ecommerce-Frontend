export function formatTHB(value) {
    if (value === undefined || value === null) return "";
    try {
        return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
        maximumFractionDigits: 0
        }).format(value);
    } catch {
        return `${value} ฿`;
    }
}