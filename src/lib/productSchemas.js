export function assertProductShape(p) {
    if (!p || typeof p.id !== "string") throw new Error("product.id string required");
    if (!Array.isArray(p.optionGroups)) throw new Error("optionGroups[] required");
    for (const g of p.optionGroups) {
        if (!g.key || !g.type) throw new Error(`group ${g?.label || g?.key} missing key/type`);
        if (!Array.isArray(g.values) || g.values.length === 0) throw new Error(`${g.key} needs values[]`);
    }
    return true;
}