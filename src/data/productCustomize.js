import { OPT_MULTI, OPT_SINGLE } from "@/lib/productOptions";

// Example product data
export const SAMPLE_COLLAR = {
    id: "collar-001",
    name: "HugPaw Smart Collar",
    basePrice: 400,
    images: ["/public/images/Collar1.jpg"],
    description: "More than just a collar It's their identity… Give your pet a collar that reflects who they are. Customize the color, size, and even engrave their name. Want extra peace of mind? Add GPS tracking and app connectivity to keep them safe, wherever they roam.",
    optionGroups: [
        {
            key: "color",
            label: "Color",
            type: OPT_SINGLE,
            required: true,
            ui: "swatch",
            values: [
                { value: "red", label: "Red", swatch: "#EF4444" },
                { value: "blue", label: "Blue", swatch: "#3B82F6" },
                { value: "black", label: "Black", swatch: "#111827", default: true },
            ]
        },
        {
            key: "size",
            label: "Size",
            type: OPT_SINGLE,
            required: true,
            ui: "buttons",
            values: [
                { value: "XS", label: "XS", priceAdj: -70 },
                { value: "S", label: "S", },
                { value: "M", label: "M", default: true },
                { value: "L", label: "L", priceAdj: 70 },
                { value: "XL", label: "XL", priceAdj: 120 },
            ]
        },
        {
            key: "features",
            label: "Smart Features",
            type: OPT_MULTI,
            required: false,
            ui: "checkbox",
            values: [
                { value: "gps", label: "GPS Tracker", priceAdj: 350 },
                { value: "led", label: "LED Light", priceAdj: 180 },
                { value: "nfc", label: "NFC Tag", priceAdj: 100 },
            ]
        }
    ],
    // variants: [
    //     { sku: "COL-RED-XS", attrs: { color: "red", size: "XS" }, price: 530 },
    //     { sku: "COL-BLUE-M", attrs: { color: "blue", size: "M" }, price: 400 },
    //     { sku: "COL-BLACK-XL", attrs: { color: "black", size: "XL" }, price: 720 },
    // ]
};