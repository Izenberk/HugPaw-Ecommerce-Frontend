import { SAMPLE_COLLAR } from "../productOptions";

export const PRODUCTS = {
    "collar-001": SAMPLE_COLLAR,
};

export function getProductById(id) {
    return PRODUCTS[id] ?? null;
}