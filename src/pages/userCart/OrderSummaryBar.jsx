import { Trash2 } from "lucide-react";
import { useCart } from "./CartContext";

export default function OrderSummaryBar() {
  const { items, clearCart } = useCart();

  const handleClearAll = () => {
    if (items.length === 0) return;
    const ok = window.confirm("Are you sure to delete all?");
    if (ok) {
      clearCart();
    }
  };
  return (
    // {/* Order Summary Bar */}
    <section className="md:w-[100%]">
      <div className="bg-surface flex justify-between w-[80%] mx-auto items-center px-4 py-2 rounded-lg shadow mt-4 border-1">
        <h2 className="text-lg font-bold text-onPrimary">Order Summary</h2>
        <button
          className="text-onPrimary hover:text-orange-600 cursor-pointer"
          onClick={handleClearAll}
          title="Clear all items"
        >
          <Trash2 />
        </button>
      </div>
    </section>
  );
}
