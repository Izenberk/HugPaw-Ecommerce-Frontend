import CategoryRow from "@/components/home/CategoryRow";
import Features from "@/components/home/Features";
import Guarantees from "@/components/home/Guarantee";
import HeroSplit from "@/components/home/HeroSplit";
import PressMentions from "@/components/home/PressMentions";
import PromoStrip from "@/components/home/PromoStrip";
import ReviewGrid from "@/components/home/ReviewGrid";

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
      desc: "Watering made powerful.",
      href: "/products/water-001",
      imageSrc: "/images/products/Automatic-Water-Dispenser.jpg",
      imageHoverSrc: "/images/products/Collage-Water-Dispenser.jpg",
      imageAlt: "Automatic water dispenser",
    },
    {
      id: "food",
      title: "Food Dispenser",
      desc: "Mealtime, now personal.",
      href: "/products/feeder-001",
      imageSrc: "/images/products/Automatic-Feeder.jpg",
      imageHoverSrc: "/images/products/Collage-Feeder.jpg",
      imageAlt: "Automatic food dispenser",
    },
  ];

  const reviews = [
    {
      id: "r1",
      name: "Anna",
      stars: 5,
      quote:
        "I loved how easy it was to design Bella’s collar. The engraving is perfect, and the color matches her personality so well!",
      imageSrc: "/images/home/review-collar.png",
      imageAlt: "Automatic food dispenser",
    },
    {
      id: "r2",
      name: "Mark",
      stars: 4,
      quote:
        "The automatic feeder has been a lifesaver. I customized the color to match my kitchen, and Milo loves the consistent meal times!",
      imageSrc: "/images/home/review-feeder.png",
      imageAlt: "Automatic food dispenser",
    },
    {
      id: "r3",
      name: "Sophie",
      stars: 5,
      quote:
        "Coco’s new water fountain is not only cute but super quiet. I added her name to the side—she drinks more water now too!",
      imageSrc: "/images/home/review-water-dispenser.png",
      imageAlt: "Automatic water dispenser",
    },
  ];

  return (
    <main>
      <HeroSplit
        title={["More Than Pets", "They’re Family"]}
        subtitle="Create unique items for your furry friends"
        cta={{ label: "Shop Now", href: "/catalog" }}
        imageSrc="/src/assets/images/home/pet-owner1.png"
        imageAlt="Happy pet family"
      />
      <CategoryRow
        title="Highest Functionality for Your Four-Legged Friend"
        items={categories}
      />
      <PressMentions />

      <Features />

      <PromoStrip
        badge="Coming Soon"
        title="Exciting deals are on the way!"
        subtitle="We’re preparing something special for you. Stay tuned for the exclusive offers."
        cta={{ label: "Explore Products", href: "/catalog" }}
      />

      <ReviewGrid
        title="Review"
        subtitle="Check out what our HugPaw Community has to say"
        items={reviews}
      />

      <Guarantees />
    </main>
  );
}
