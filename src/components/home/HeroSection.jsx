import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      {/* Hero Container */}
      <div className="relative w-full h-[90vh] rounded-[32px] overflow-hidden bg-black flex">
        {/* Background image / video */}
        <img
          src="/images/home/hero-background.jpg"
          alt="Red light therapy"
          className="absolute inset-0 w-full h-full object-cover object-[center_90%]"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content (ฝั่งซ้าย) */}
        <div className="relative z-10 flex items-center justify-center w-1/2 h-full">
          <div className="flex flex-col text-left max-w-md text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              For Every Paw <br /> in the Family
            </h1>
            <p className="text-lg mb-6 text-gray-200">
              Smart, simple essentials made with love <br />
              for your four-legged family.
            </p>

            {/* ใช้ shadcn Button */}
               <div className="mt-6">
                <Link
              to="/catalog"
              className="inline-flex items-center rounded-full px-6 py-4
                         bg-[#d1d74e] text-black text-[16px] font-bold"
            >
              Discover All
            </Link>
              </div>
          </div>
        </div>

        {/* Right side (รูปภาพ) */}
        <div className="w-1/2" />
      </div>
    </section>
  );
}
