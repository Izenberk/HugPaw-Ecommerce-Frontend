import { OPT_MULTI, OPT_SINGLE } from "@/lib/productOptions";

/** 🔧 Fix: remove `/public` prefix */
export const SAMPLE_COLLAR = {
    id: "collar-001",
    name: "HugPaw Smart Collar",
    basePrice: 400,
    images: ["/images/Collar1.jpg"],
    description:
        "More than just a collar—it's their identity. Customize color, size, and engrave their name. Add GPS and app connectivity for extra peace of mind.",
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
        ],
        },
        {
        key: "size",
        label: "Size",
        type: OPT_SINGLE,
        required: true,
        ui: "buttons",
        values: [
            { value: "XS", label: "XS", priceAdj: -70 },
            { value: "S", label: "S" },
            { value: "M", label: "M", default: true },
            { value: "L", label: "L", priceAdj: 70 },
            { value: "XL", label: "XL", priceAdj: 120 },
        ],
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
        ],
        },
    ],
};

/** 🍽️ Smart Feeder */
export const SAMPLE_FEEDER = {
    id: "feeder-001",
    name: "HugPaw Smart Feeder",
    basePrice: 1890,
    images: ["/images/Feeder2.png"],
    description:
        "Automated feeding with portion control, schedules, and optional camera. Keep meals timely and pets happy—even when you’re away.",
    optionGroups: [
        {
        key: "capacity",
        label: "Hopper Capacity",
        type: OPT_SINGLE,
        required: true,
        ui: "buttons",
        values: [
            { value: "2L", label: "2 L", priceAdj: 0, default: true },
            { value: "4L", label: "4 L", priceAdj: 300 },
            { value: "6L", label: "6 L", priceAdj: 600 },
        ],
        },
        {
        key: "color",
        label: "Color",
        type: OPT_SINGLE,
        required: true,
        ui: "swatch",
        values: [
            { value: "white", label: "White", swatch: "#FFFFFF", default: true },
            { value: "black", label: "Black", swatch: "#111827" },
            { value: "sand", label: "Sand", swatch: "#D6C3A1" },
        ],
        },
        {
        key: "power",
        label: "Power Mode",
        type: OPT_SINGLE,
        required: true,
        ui: "radio",
        values: [
            { value: "dc", label: "DC Adapter", default: true },
            { value: "dc+battery", label: "DC + Battery Backup", priceAdj: 250 },
            { value: "usb-c", label: "USB-C PD", priceAdj: 150 },
        ],
        },
        {
        key: "smart",
        label: "Smart Add-ons",
        type: OPT_MULTI,
        required: false,
        ui: "checkbox",
        values: [
            { value: "wifi", label: "Wi-Fi App Control", priceAdj: 200, default: true },
            { value: "camera", label: "1080p Camera + 2-Way Audio", priceAdj: 900 },
            { value: "voice", label: "Custom Mealtime Voice", priceAdj: 120 },
        ],
        },
        {
        key: "bowl",
        label: "Bowl Material",
        type: OPT_SINGLE,
        required: true,
        ui: "select",
        values: [
            { value: "plastic", label: "BPA-Free Plastic", default: true },
            { value: "stainless", label: "Stainless Steel", priceAdj: 180 },
            { value: "ceramic", label: "Ceramic", priceAdj: 260 },
        ],
        },
    ],
  // variants: [
  //   { sku: "FD-2L-WH-DC", attrs: { capacity: "2L", color: "white", power: "dc", bowl: "plastic" }, price: 1890 },
  //   { sku: "FD-4L-BK-DCB", attrs: { capacity: "4L", color: "black", power: "dc+battery", bowl: "stainless" }, price: 2620 },
  // ]
};

/** 💧 Water Dispenser */
export const SAMPLE_WATER_DISPENSER = {
    id: "water-001",
    name: "HugPaw Smart Water Dispenser",
    basePrice: 1290,
    images: ["/images/water-dispenser.jpg"],
    description:
        "Fresh, filtered water on tap. Ultra-quiet pump, replaceable filters, and optional UV-C sterilization to keep every sip pristine.",
    optionGroups: [
        {
        key: "reservoir",
        label: "Reservoir Size",
        type: OPT_SINGLE,
        required: true,
        ui: "buttons",
        values: [
            { value: "1.5L", label: "1.5 L", default: true },
            { value: "2.5L", label: "2.5 L", priceAdj: 200 },
            { value: "3.5L", label: "3.5 L", priceAdj: 380 },
        ],
        },
        {
        key: "color",
        label: "Color",
        type: OPT_SINGLE,
        required: true,
        ui: "swatch",
        values: [
            { value: "white", label: "White", swatch: "#FFFFFF", default: true },
            { value: "graphite", label: "Graphite", swatch: "#1F2937" },
            { value: "mint", label: "Mint", swatch: "#A7F3D0" },
        ],
        },
        {
        key: "filtration",
        label: "Filtration",
        type: OPT_SINGLE,
        required: true,
        ui: "radio",
        values: [
            { value: "standard", label: "Standard Charcoal", default: true },
            { value: "triple", label: "Triple-Stage (Sediment/Carbon/Resin)", priceAdj: 240 },
        ],
        },
        {
        key: "pump",
        label: "Pump & Hygiene",
        type: OPT_MULTI,
        required: false,
        ui: "checkbox",
        values: [
            { value: "quiet", label: "Ultra-Quiet Pump", priceAdj: 120, default: true },
            { value: "uvc", label: "UV-C Sterilization", priceAdj: 420 },
            { value: "lowlevel", label: "Low-Water Alert", priceAdj: 150 },
        ],
        },
        {
        key: "power",
        label: "Power",
        type: OPT_SINGLE,
        required: true,
        ui: "radio",
        values: [
            { value: "usb-c", label: "USB-C", default: true },
            { value: "battery", label: "Rechargeable Battery Base", priceAdj: 350 },
        ],
        },
    ],
  // variants: [
  //   { sku: "WT-15-WH-STD", attrs: { reservoir: "1.5L", color: "white", filtration: "standard", power: "usb-c" }, price: 1290 },
  //   { sku: "WT-25-GR-TRI-UV", attrs: { reservoir: "2.5L", color: "graphite", filtration: "triple", power: "usb-c", pump: ["uvc","quiet"] }, price: 1770 },
  // ]
};
