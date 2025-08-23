import collar from "/images/products/Collage-Collar.jpg"
import dispenser from "/images/products/Automatic-Water-Dispenser.jpg";
import feeder from "/images/products/Automatic-Feeder.jpg";

export const CATEGORIES = ["Accessories", "Hydration", "Feeding"];

export const PRODUCTS_MOCK = [
    {
        id: "collar-001",                    // ✅ same ID used by productById()
        name: "HugPaw Smart Collar",
        price: 400,
        imageUrl: collar,
        category: "Accessories",
        tags: ["customizable", "GPS", "engraving", "waterproof"],
        description:
        "More than just a collar—it's their identity. Customize color, size, and engrave their name. Add GPS and app connectivity for extra peace of mind.",
    },
    {
        id: "water-001",
        name: "HugPaw Water Dispenser",
        price: 700,
        imageUrl: dispenser,
        category: "Hydration",
        tags: ["smart", "auto-refill", "filter-tracking", "quiet-pump", "bpa-free", "dishwasher-safe"],
        description:
        "Fresh, filtered water with optional smart tracking and ultra-quiet pump. Custom looks to match your home.",
    },
    {
        id: "feeder-001",
        name: "HugPaw Smart Feeder",
        price: 750,
        imageUrl: feeder,
        category: "Feeding",
        tags: ["app-controlled", "schedule", "portion-control", "voice-playback", "dual-power", "smart", "stainless-bowl"],
        description:
        "Automated meals with portion control, schedules, and optional voice playback—personalized mealtime, every time.",
    },
];