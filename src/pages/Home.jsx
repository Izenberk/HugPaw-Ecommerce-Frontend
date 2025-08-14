import CategoryRow from "@/components/home/CategoryRow";
import HeroSplit from "@/components/home/HeroSplit";
import PromoStrip from "@/components/home/PromoStrip";
import ReviewGrid from "@/components/home/ReviewGrid";

export default function Home() {
  const categories = [
    { id: "collar", title: "Collar", desc: "More than just a pet’s identity.", href: "/customize/collar", imageSrc:"/src/assets/images/products/collar.jpg", imageAlt:"Pet Collar" },
    { id: "water", title: "Water Dispenser", desc: "Watering made powerful.", href: "/customize/water", imageSrc:"/src/assets/images/products/feeder.jpg", imageAlt:"Feeder"},
    { id: "food", title: "Food Dispenser", desc: "Mealtime, now personal.", href: "/customize/food", imageSrc:"/src/assets/images/products/water-dispenser.jpg", imageAlt:"Water Dispenser" },
  ];

  const reviews = [
    { id: "r1", name: "Anna and bella", quote: "I loved how easy it was to design Bella’s collar. The engraving is perfect, and the color matches her personality so well!" },
    { id: "r2", name: "Anna and bella", quote: "Great quality and fast shipping. We get compliments every week." },
    { id: "r3", name: "Anna and bella", quote: "Customization was simple and the fit is perfect." },
  ];

  return (
    <main className="space-y-8 pb-12">
      <HeroSplit
        title="More Than Pets — They’re Family"
        subtitle="Create unique items for your furry friends"
        cta={{ label: "Shop Now", href: "/catalog" }}
        imageSrc="/src/assets/images/home/pet-owner.png"
        imageAlt="Happy pet family"
      />

      <CategoryRow
        title="Our Products"
        subtitle="At HugPaw, you can craft comfort, style, and tech — just for your buddy"
        items={categories}
      />

      <PromoStrip
        title="20% Off Your First Custom Pet Product"
        subtitle="Design the perfect item for your friend today and enjoy free shipping on your first order."
        cta={{ label: "Claim Your Discount", href: "#" }}
      />

      <ReviewGrid title="Review" items={reviews} />
    </main>
  );
}
