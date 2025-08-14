import CategoryRow from "@/components/home/CategoryRow";
import HeroSplit from "@/components/home/HeroSplit";
import PromoStrip from "@/components/home/PromoStrip";
import ReviewGrid from "@/components/home/ReviewGrid";

export default function Home() {
  return (
    <main className="space-y-16">
      <HeroSplit />
      <CategoryRow />
      <PromoStrip />
      <ReviewGrid />
    </main>
  );
}