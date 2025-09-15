import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
     <section className="min-h-[90vh] p-10 pt-0 pb-0">
      <div
        className="w-full h-[80vh] pb-20 rounded-4xl overflow-hidden flex items-center justify-left text-center text-white"
        style={{
          backgroundImage: "url('/images/home/hero-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 px-40 text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-worksans">
            For Every Paw <br /> in the Family
          </h1>
          <p className="text-lg mb-6">
            Smart, simple essentials made with love <br />
            for your four-legged family.
          </p>
          <Link to="/catalog" className="primary-button">
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
