import { Link } from "react-router-dom";

export default function FeederSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 items-center gap-10">

        <div className="flex justify-center order-1 md:order-1">
          <img
            src="/images/home/review-feeder.png"
            alt="Automatic Pet Feeder"
            className="object-contain h-[360px] md:h-[420px] rounded-xl overflow-hidden"
          />
        </div>

        <div className="text-gray-800 order-2 md:order-2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Smart Feeding Made Easy
          </h2>
          <h3 className="text-xl font-semibold mb-3">MealMate</h3>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            The MealMate automatic feeder ensures your pet never misses a meal.
            With programmable portions and a sleek design, it’s perfect for
            maintaining healthy eating habits — even when you're away.
          </p>
          <Link to="/products/feeder-001" className="secondary-button">
            View Product
          </Link>

        </div>
      </div>
    </section>
  );
}
