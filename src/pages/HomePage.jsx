import HeroSection from "@/components/home/HeroSection";
import PressMentions from "@/components/home/PressMentions";
import CategoryRow from "@/components/home/CategoryRow";
import CollarSection from "@/components/home/CollarSection";
import FeederSection from "@/components/home/FeederSection";
import WaterDispenserSection from "@/components/home/WaterDispenserSection";
import ReviewGrid from "@/components/home/ReviewGrid";
import PromoStrip from "@/components/home/PromoStrip";
import Guarantees from "@/components/home/Guarantee";

export default function HomePage() {
  const categories = [
    {
      id: "collar",
      title: "Collar",
      desc: "More than just a pet’s identity.",
      href: "/products/collar-001",
      imageSrc: "/images/products/Red-Collar.jpg",
      imageHoverSrc: "/images/products/Collage-Collar.jpg",
      imageAlt: "Red pet collar",
    },
    {
      id: "water",
      title: "Water Dispenser",
      desc: "The next generation of pet hydration",
      href: "/products/water-001",
      imageSrc: "/images/products/Automatic-Water-Dispenser.jpg",
      imageHoverSrc: "/images/products/Collage-Water-Dispenser.jpg",
      imageAlt: "Automatic water dispenser",
    },
    {
      id: "food",
      title: "Feeder",
      desc: "Make mealtimes easy, for both of you",
      href: "/products/feeder-001",
      imageSrc: "/images/products/Automatic-Feeder.jpg",
      imageHoverSrc: "/images/products/Collage-Feeder.jpg",
      imageAlt: "Automatic feeder",
    },
  ];

  const reviews = [
    {
      id: "r1",
      name: "Anna",
      stars: 5,
      quote:
        "I loved how easy it was to design Bella’s collar. It's stylish and the color matches her personality so well!",
      imageSrc: "/images/home/review-collar.png",
      imageAlt: "Dog wearing a red collar",
    },
    {
      id: "r2",
      name: "Sophie",
      stars: 5,
      quote:
        "Coco’s new water fountain is not only cute but super quiet. It's the perfect for her. She drinks more water now too!",
      imageSrc: "/images/home/review-water-dispenser.png",
      imageAlt: "Cat next to a water dispenser",
    },
    {
      id: "r3",
      name: "Mark",
      stars: 4,
      quote:
        "The automatic feeder has been a lifesaver. I customized the color to match my kitchen. I love the consistent meal times!",
      imageSrc: "/images/home/review-feeder.png",
      imageAlt: "Three cats using automatic food dispensers",
    },
  ];

  return (
    <main>
      <HeroSection />
      <PressMentions />
      <CategoryRow items={categories} />
      <CollarSection />
      <WaterDispenserSection />
      <FeederSection />
      <ReviewGrid items={reviews} />
      <PromoStrip />
      <Guarantees />
    </main>
  );
}
