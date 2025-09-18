import { Link } from "react-router-dom";
export default function CollarSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 items-center gap-10">
  
        <div className="flex justify-center">
          <img
            src="/images/home/product-collar.png"
            alt="Modern Pet Collar"
            className="object-contain h-[360px] md:h-[420px] rounded-xl overflow-hidden"
          />
        </div>

        <div>
          <h1 className="title-text mb-4">
            Style Meets Comfort
          </h1>
          <h2 className="subtitle-text font-bold mb-2">HugPaw Smart Collar</h2>
          <p className="subtitle-text mb-6">
            The HugPaw Smart Collar combines durability with modern design. Crafted
            from premium materials, it keeps your pet comfortable while adding a
            stylish touch for everyday adventures.
          </p>
          <Link to="/products/collar-001" className="secondary-button">
            View Product
          </Link>
        </div>
      </div>
    </section>
  );
}
