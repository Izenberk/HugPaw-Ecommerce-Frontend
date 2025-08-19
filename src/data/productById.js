import { SAMPLE_COLLAR, SAMPLE_FEEDER, SAMPLE_WATER_DISPENSER } from "./productCustomize";

export const PRODUCTS = [
    SAMPLE_COLLAR,
    SAMPLE_FEEDER,
    SAMPLE_WATER_DISPENSER
];

export function productById(id) {
    return PRODUCTS.find(p => p.id === id) ?? null;
}