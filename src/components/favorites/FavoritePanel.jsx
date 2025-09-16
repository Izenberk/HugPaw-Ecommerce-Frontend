import { useFavorites } from "@/lib/favorites";
import { Heart } from "lucide-react";
import { FavoriteCard } from "./FavoriteCard";
import { Button } from "../ui/button";
import { useCart } from "@/context/CartContext";

export default function FavoritePanel() {
  const { items, clearFavorites } = useFavorites();
  const { addItem } = useCart();

  // ความสูง navbar (หรือ top bar) + ระยะเผื่อด้านล่าง
  const NAV_H = 88;   // ปรับตามของจริง เช่น 72/80/96
  const BOTTOM_GAP = 24;

  if (!items?.length) {
    return (
      <aside className="sticky top-[88px]">
        <div className="rounded-2xl border bg-card p-8 text-center">
          <Heart className="mb-2 h-8 w-8" />
          <p className="text-sm text-muted-foreground">
            No favorites yet. Go heart some gear for your floof.
          </p>
        </div>
      </aside>
    );
  }

  return (
    // ทำให้ container “ยึดตำแหน่ง” ตาม viewport (ไม่เลื่อน)
    <aside className="sticky top-[88px]">
      {/* กล่องจริงของ panel */}
      <div
        className="rounded-2xl border bg-card shadow-sm flex flex-col overflow-hidden"
        style={{
          // สูงสุดไม่เกินจอ: 100vh - (navbar + ระยะเผื่อล่าง)
          maxHeight: `calc(60vh - ${NAV_H}px - ${BOTTOM_GAP}px)`,
        }}
      >
        {/* Header คงที่ */}
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold">Your Favorites</h2>
          <Button variant="outline" size="sm" onClick={clearFavorites}>
            Clear all
          </Button>
        </div>

        {/* เนื้อหาเลื่อนภายใน */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 md:py-5 pr-3 overscroll-contain [scrollbar-gutter:stable] 
                     [mask-image:linear-gradient(to_bottom,transparent,black_12px,black_calc(100%-12px),transparent)]"
        >
          <div className="flex flex-col gap-4 md:gap-6">
            {items.map((it) => (
              <FavoriteCard key={it.id} item={it} addToCart={addItem} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
