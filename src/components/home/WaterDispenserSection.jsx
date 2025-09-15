import { Link } from "react-router-dom";
export default function WaterDispenserSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 items-center gap-10">
        <div className="text-gray-800 order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Fresh Water Anytime
          </h2>
          <h3 className="text-xl font-semibold mb-3">AquaFlow</h3>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Keep your pet hydrated with the AquaFlow automatic water dispenser.
            Designed with smart filtration and continuous circulation, it
            ensures fresh and clean water all day long. Perfect for busy pet
            owners.
          </p>
          <Link to="/products/water-001" className="secondary-button">
            View Product
          </Link>
        </div>

        <div className="flex justify-center order-1 md:order-2">
          <img
            src="/images/home/review-water-dispenser.png"
            alt="Automatic Pet Water Dispenser"
            className="object-contain h-[360px] md:h-[420px] rounded-xl overflow-hidden"
          />
        </div>
      </div>
    </section>
  );
}
