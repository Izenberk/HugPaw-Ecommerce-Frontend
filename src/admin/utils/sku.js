const ABBRV = {
    Type: { Collar: "COL", Dispenser: "DPS", Feeder: "FDR", "Smart Module": "SMF", Addon: "ADD" },
    Color: { Black: "BLK", White: "WHT" },
    "Power Mode": { "DC Adapter": "DC" },
    Power: { "USB-C": "USBC" },
    Size: { XS: "XS", "1.5L": "1.5", "2L": "2L" },
    Filtration: { "Standard Charcoal": "STD" },
    "Pump & Hygiene": { "Ultra Quiet Pump": "UQP" },
    "Smart Add-ons": { "WiFi App Control": "WF" },
    "Bowl Material": { "BPA-Free Plastic": "BPL" },
    Kind: { Variant: "", Addon: "" },
};

const ORDER = ["Type","Size","Color","Filtration","Pump & Hygiene","Power","Power Mode","Smart Add-ons","Bowl Material"];

export function buildSku(attrs) {
    const map = Object.fromEntries((attrs||[]).map(a => [a.k, a.v]));
    const parts = [];
    for (const key of ORDER) {
        const v = map[key];
        if (!v) continue;
        const abbr = ABBRV[key]?.[v] ?? String(v).replace(/\s+/g,"").toUpperCase();
        if (abbr) parts.push(abbr);
    }
    return parts.join("-");
}

export function getAttr(attrs, key) {
    return Array.isArray(attrs) ? (attrs.find(a => a.k === key)?.v || "") : "";
}
