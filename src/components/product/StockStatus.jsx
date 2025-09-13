// src/components/product/StockStatus.jsx
export default function StockStatus({ hasVariants, currentStock, allRequiredChosen, lowStockThreshold = 5 }) {
    if (!hasVariants) return null;

    return (
        <div aria-live="polite" className="text-xs font-medium">
        {!allRequiredChosen && <span className="text-muted-foreground">Select required options</span>}

        {allRequiredChosen && currentStock === 0 && (
            <span className="text-red-600">Out of stock</span>
        )}

        {allRequiredChosen && typeof currentStock === "number" && currentStock > 0 && (
            <span className={currentStock <= lowStockThreshold ? "text-amber-600" : "text-emerald-700"}>
            {currentStock <= lowStockThreshold ? `Low stock: ${currentStock}` : `In stock: ${currentStock}`}
            </span>
        )}
        </div>
    );
}
