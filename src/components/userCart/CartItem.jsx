// /src/pages/userCart/CartItem.jsx
import { Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatTHB } from "@/lib/formatters";

export default function CartItem({ item }) {
  const { increment, decrement, removeItem } = useCart();
  if (!item) return null;

  const { imageUrl, image, name, unitPrice, quantity, config } = item;
  const FALLBACK_IMG = "/images/placeholder-product.png";
  const imgSrc = imageUrl || image || FALLBACK_IMG;
  const lineTotal = unitPrice * quantity;
  const attrs = Object.entries(config || {})
    .map(([k, v]) =>
      Array.isArray(v) ? `${k}: ${v.join(", ")}` : `${k}: ${v}`
    )
    .join(" • ");

  return (
    <div className="w-[80%] max-w-4xl flex gap-4 p-4 rounded-lg shadow mx-auto border mb-4 bg-card text-card-foreground">
      <div className="w-24 h-24 flex-shrink-0 rounded-md border bg-white relative">
        <img
          src={imgSrc}
          alt={name}
          className="absolute inset-0 w-full h-full object-contain p-2 rounded-md"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="text-sm lg:text-base flex-col">
          <h3 className="font-semibold">{name}</h3>
           <p className="opacity-80 ">{attrs}</p>

          {/* ราคาเดี่ยว + ราคารวมตามจำนวน */}
          <div className="mt-1 flex items-center gap-3">
            <span className="text-sm opacity-70">
              {formatTHB(unitPrice)} / Piece
            </span>
            <span className="text-sm font-semibold">
              = {formatTHB(lineTotal)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2 items-center">
            <button
              className="px-2 bg-white border rounded hover:bg-gray-100 disabled:opacity-50"
              onClick={() => decrement(item)}
              disabled={quantity <= 1}
              aria-label="decrease quantity"
            >
              –
            </button>
            <span>{quantity}</span>
            <button
              className="px-2 bg-white border rounded hover:bg-gray-100 "
              onClick={() => increment(item)}
              aria-label="increase quantity"
            >
              +
            </button>
          </div>

          <button
            className="text-onPrimary hover:text-orange-600 cursor-pointer"
            onClick={() => removeItem(item)}
            title="Delete from cart"
          >
            <Trash2 />
          </button>
        </div>
      </div>
    </div>
  );
}
