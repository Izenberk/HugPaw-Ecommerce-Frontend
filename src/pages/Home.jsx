import CategoryRow from "@/components/home/CategoryRow";
import HeroSplit from "@/components/home/HeroSplit";
import PromoStrip from "@/components/home/PromoStrip";
import ReviewGrid from "@/components/home/ReviewGrid";

export default function Home() {
  const categories = [
    {
      id: "collar",
      title: "Collar",
      desc: "More than just a pet’s identity.",
      href: "/products/collar-001",
      imageSrc: "/images/products/Red-Collar.jpg",
      imageAlt: "Red pet collar",
    },
    {
      id: "water",
      title: "Water Dispenser",
      desc: "Watering made powerful.",
      href: "/products/water-001",
      imageSrc: "/images/products/Automatic-Water-Dispenser.jpg",
      imageAlt: "Automatic water dispenser",
    },
    {
      id: "food",
      title: "Food Dispenser",
      desc: "Mealtime, now personal.",
      href: "/products/feeder-001",
      imageSrc: "/images/products/Automatic-Feeder.jpg",
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
    },
    {
      id: "r2",
      name: "Mark",
      stars: 4,
      quote:
        "The automatic feeder has been a lifesaver. I customized the color to match my kitchen, and Milo loves the consistent meal times!",
    },
    {
      id: "r3",
      name: "Sophie",
      stars: 5,
      quote:
        "Coco’s new water fountain is not only cute but super quiet. I added her name to the side—she drinks more water now too!",
    },
  ];

  return (
    // ให้แต่ละ section คุม padding ตัวเอง → main ไม่ต้อง space-y ใหญ่
    <main>
      <HeroSplit
        title={["More Than Pets", "They’re Family"]}
        subtitle="Create unique items for your furry friends"
        cta={{ label: "Shop Now", href: "/catalog" }}
        imageSrc="/src/assets/images/home/hero.jpg"
        imageAlt="Happy pet family"
      />

      <CategoryRow
        title="Our Products"
        subtitle="At HugPaw, you can craft comfort, style, and tech — just for your buddy"
        items={categories}
      />

      <PromoStrip
        badge="Limited Offer"
        title="20% Off Your First Custom Pet Product"
        subtitle="Design the perfect item for your friend today and enjoy free shipping on your first order."
        cta={{ label: "Claim Your Discount", href: "#claim" }}
      />

      <ReviewGrid
        title="Review"
        subtitle="Check out what our HugPaw Community has to say"
        items={reviews}
      />
    </main>
  );
}
