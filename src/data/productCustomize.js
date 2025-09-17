// productCustomize.js
// Frontend config for the customize pages.
// - No priceAdj here (pricing comes from backend).
// - No local stock (availability comes from backend).
// - `features` group holds add-ons; each add-on has its own SKU (starts with "SMF-").
// - Optional `skuFromConfig()` for local mapping (FE convenience only).

/** 🐾 Smart Collar */
export const SAMPLE_COLLAR = {
  id: "collar-001",
  name: "HugPaw Smart Collar",

  // Used to resolve the family on the backend. Should exist in your DB.
  anchorSku: "COL-M-BLUE",

  basePrice: 400, // display fallback until backend resolves a variant
  images: ["/images/products/Collar1.jpg"],
  description:
    "More than just a collar—it's their identity. Customize color, size, and add smart features.",
  tags: ["collar", "pet", "smart"],

  // IMPORTANT: Keys & values must match your DB attribute names/casing.
  optionGroups: [
    {
      key: "Color", // DB attribute: "Color"
      label: "Color",
      type: "single",
      required: true,
      ui: "swatch",
      values: [
        { value: "Black", label: "Black", swatch: "#111827" },
        { value: "Red",   label: "Red",   swatch: "#EF4444" },
        { value: "Blue",  label: "Blue",  swatch: "#3B82F6", default: true },
        { value: "Green", label: "Green", swatch: "#32a850" }
      ],
    },
    {
      key: "Size", // DB attribute: "Size"
      label: "Size",
      type: "single",
      required: true,
      ui: "buttons",
      values: [
        { value: "XS", label: "XS" },
        { value: "S",  label: "S"  },
        { value: "M",  label: "M", default: true },
        { value: "L",  label: "L"  },
        { value: "XL", label: "XL" }
      ],
    },
    // Add-ons (each is its own product SKU; stock/pricing from backend)
    {
      key: "features",
      label: "Smart Features",
      type: "multi",
      required: false,
      ui: "checkbox",
      values: [
        { value: "gps", label: "GPS Tracker", sku: "SMF-GPS" },
        { value: "led", label: "LED Light",   sku: "SMF-LED" },
        { value: "nfc", label: "NFC Tag",     sku: "SMF-NFC" },
      ],
    },
  ],

  // Optional convenience mapper (FE only). Backend still resolves via /variants/:anchorSku/resolve
  skuFromConfig(cfg = {}) {
    const size = cfg?.Size;
    const color = cfg?.Color;
    if (!size || !color) return null;

    const COLOR = {
      Black: "BLACK",
      Blue:  "BLUE",
      Red:   "RED",
      Green: "GREEN",
    };
    const colorCode = COLOR[color];
    if (!colorCode) return null;

    return `COL-${size}-${colorCode}`; // e.g. "COL-M-BLUE"
  },

  // Bump when option structure changes to invalidate saved presets
  configVersion: 3,
};

/** 🍽️ Smart Feeder */
export const SAMPLE_FEEDER = {
  id: "feeder-001",
  name: "HugPaw Smart Feeder",

  // ✅ Exists in your DB (you showed the doc)
  anchorSku: "FDR-2L-WHT-DC-BPL",

  basePrice: 750, // fallback; server is source of truth
  images: ["/images/products/Collage-Feeder.jpg"],
  description:
    "Automated feeding with portion control, schedules, and optional camera.",

  // IMPORTANT: keys/values match DB attribute names + casing
  optionGroups: [
    {
      key: "Size",
      label: "Hopper Size",
      type: "single",
      required: true,
      ui: "buttons",
      values: [
        { value: "2 L", label: "2 L", default: true },
        { value: "4 L", label: "4 L" },
        { value: "6 L", label: "6 L" },
      ],
    },
    {
      key: "Color",
      label: "Color",
      type: "single",
      required: true,
      ui: "swatch",
      values: [
        { value: "White", label: "White",  swatch: "#FFFFFF", default: true },
        { value: "Black", label: "Black",  swatch: "#111827" },
        { value: "Sand",  label: "Sand",   swatch: "#D6C3A1" },
      ],
    },
    {
      key: "Power Mode",
      label: "Power Mode",
      type: "single",
      required: true,
      ui: "radio",
      values: [
        { value: "DC Adapter",           label: "DC Adapter",           default: true },
        { value: "DC + Battery Backup",  label: "DC + Battery Backup" },
        { value: "USB-C PD",             label: "USB-C PD" }, // adjust to "USB-C" if DB uses that
      ],
    },
    {
      key: "Bowl Material",
      label: "Bowl Material",
      type: "single",
      required: true,
      ui: "select",
      values: [
        { value: "BPA-Free Plastic", label: "BPA-Free Plastic", default: true },
        { value: "Stainless Steel",  label: "Stainless Steel" },
        { value: "Ceramic",          label: "Ceramic" },
      ],
    },
    // Add-ons: separate SKUs checked via /api/inventory/availability
    {
      key: "features",
      label: "Smart Add-ons",
      type: "multi",
      required: false,
      ui: "checkbox",
      values: [
        { value: "wifi",   label: "Wi-Fi App Control",          sku: "SMF-WIFI"   },
        { value: "camera", label: "1080p Camera + 2-Way Audio", sku: "SMF-CAMERA" },
        { value: "voice",  label: "Custom Mealtime Voice",      sku: "SMF-VOICE"  },
      ],
    },
  ],

  // Optional helper for debugging / building SKUs locally (backend still resolves truth)
  skuFromConfig(cfg = {}) {
    const size  = cfg?.["Size"];           // "2 L"
    const color = cfg?.["Color"];          // "White"
    const power = cfg?.["Power Mode"];     // "DC Adapter"
    const bowl  = cfg?.["Bowl Material"];  // "BPA-Free Plastic"
    if (!size || !color || !power || !bowl) return null;

    const SIZE  = { "2 L": "2L", "4 L": "4L", "6 L": "6L" };
    const COLOR = { "White": "WHT", "Black": "BLK", "Sand": "SND" };
    const POWER = {
      "DC Adapter": "DC",
      "DC + Battery Backup": "DCB",
      "USB-C PD": "USBCPD",  // change to "USBC" if DB settles on that
    };
    const BOWL  = {
      "BPA-Free Plastic": "BPL",
      "Stainless Steel": "STS",
      "Ceramic": "CER",
    };

    const s = SIZE[size], c = COLOR[color], p = POWER[power], b = BOWL[bowl];
    if (!s || !c || !p || !b) return null;
    return `FDR-${s}-${c}-${p}-${b}`; // e.g., FDR-2L-WHT-DC-BPL
  },

  configVersion: 1,
};


/** 💧 Water Dispenser */
export const SAMPLE_WATER_DISPENSER = {
  id: "water-001",
  name: "HugPaw Smart Water Dispenser",

  // This exists in DB (you showed it)
  anchorSku: "DPS-1.5-WHT-STD-USBC",

  basePrice: 700,
  images: ["/images/products/Collage-Water-Dispenser.jpg"],
  description:
    "Fresh, filtered water on tap. Ultra-quiet pump with replaceable filters.",

  // Keys/values mirror DB attribute names & casing exactly
  optionGroups: [
    {
      key: "Size",
      label: "Reservoir Size",
      type: "single",
      required: true,
      ui: "buttons",
      values: [
        { value: "1.5L", label: "1.5 L", default: true },
        { value: "2.5L", label: "2.5 L" },
        { value: "3.5L", label: "3.5 L" },
      ],
    },
    {
      key: "Color",
      label: "Color",
      type: "single",
      required: true,
      ui: "swatch",
      values: [
        { value: "White",    label: "White",    swatch: "#FFFFFF", default: true },
        { value: "Graphite", label: "Graphite", swatch: "#1F2937" },
        { value: "Mint",     label: "Mint",     swatch: "#A7F3D0" },
      ],
    },
    {
      key: "Filtration",
      label: "Filtration",
      type: "single",
      required: true,
      ui: "radio",
      values: [
        { value: "Standard Charcoal", label: "Standard Charcoal", default: true },
        // ⚠ If your DB uses a different exact string for the triple filter, mirror it here.
        { value: "Triple-Stage", label: "Triple-Stage (Sediment/Carbon/Resin)" },
      ],
    },
    {
      key: "Power",
      label: "Power",
      type: "single",
      required: true,
      ui: "radio",
      values: [
        { value: "USB-C", label: "USB-C", default: true },
        { value: "Battery", label: "Rechargeable Battery" },
      ],
    },
    {
      key: "features",
      label: "Pump & Hygiene",
      type: "multi",
      required: false,
      ui: "checkbox",
      values: [
        { value: "quiet",    label: "Ultra-Quiet Pump",  sku: "SMF-QUIET" },
        { value: "uvc",      label: "UV-C Sterilization",sku: "SMF-UVC" },
        { value: "lowlevel", label: "Low-Water Alert",   sku: "SMF-LOWLEVEL" },
      ],
    },
  ],
};

