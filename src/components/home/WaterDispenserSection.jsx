import { Link } from "react-router-dom";

export default function WaterDispenserSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 items-center gap-10">
        
        <div className="flex justify-center order-1 md:order-2">
          <img
            src="/images/home/product-water-dispenser.png"
            alt="Automatic Pet Water Dispenser"
            className="object-contain w-full md:w-[420px] rounded-xl overflow-hidden"
          />
        </div>

        <div className="order-2 md:order-1">
          <h1 className="title-text mb-4">Fresh Water Anytime</h1>
          <h2 className="subtitle-text font-bold mb-2">HugPaw Water Dispenser</h2>
          <p className="subtitle-text mb-6">
            Keep your pet hydrated with the HugPaw Water Dispenser.
            Designed with smart filtration and continuous circulation, it
            ensures fresh and clean water all day long. Perfect for busy pet
            owners.
          </p>
          <Link to="/products/water-001" className="secondary-button">
            View Product
          </Link>
        </div>
      </div>
    </section>
  );
}
