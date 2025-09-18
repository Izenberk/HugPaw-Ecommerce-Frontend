import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="min-h-[90vh] sm:px-10 ">
      {/* Mobile View */}
      <div className="md:hidden">
        <img
          src="/images/home/hero-background.jpg"
          alt="Hero"
          className="w-full h-100 sm:h-80 object-cover object-[70%_40%]"
        />

        <div className="mt-6 px-4 flex flex-col items-center text-center">
          <motion.h1
            className="text-4xl sm:text-4xl font-bold m-6 font-worksans"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            For Every Paw <br /> in the Family
          </motion.h1>

          <motion.p
            className="block whitespace-normal text-base sm:text-lg text-gray-700 mb-6 font-poppins"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          >
            Pets aren't just guests in your home.
            <br />
            They're a part of your lives.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            <Link to="/catalog" className="primary-button m-4">
              Shop Now
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Desktop View */}
      <div
        className="hidden md:flex w-full h-[80vh] pb-20 pt-0 rounded-4xl overflow-hidden items-center justify-left text-center text-white"
        style={{
          backgroundImage: "url('/images/home/hero-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 px-35  text-left">
          <motion.h1
            className="text-xl lg:text-7xl font-bold mb-6 font-worksans"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
          >
            For Every Paw <br /> in the Family
          </motion.h1>

          <motion.p
            className="text-lg lg:text-2xl max-w-2xl mb-2 drop-shadow-md text-gray-200 font-poppins"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 3, ease: "easeOut" }}
          >
            Pets aren't just guests in your home.
            <span className="block mb-2" />
            They're a part of your lives.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 3, ease: "easeOut" }}
          >
            <Link to="/catalog" className="hero-button mt-12">
              Shop Now
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
