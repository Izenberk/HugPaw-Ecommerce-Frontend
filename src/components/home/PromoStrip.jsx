import React from "react";
import { Link } from "react-router-dom";

export default function PromoStrip() {
  return (
    <section className="relative mx-auto w-full max-w-[1200px] px-4 pt-10 md:px-6 pb-20">
      <div className="relative h-[68vh] md:h-[80vh] rounded-[24px] overflow-hidden shadow-lg">
        <img
          src="/images/home/promotion-background.jpg"
          alt="Promotion background"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/20" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-2 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-md">
            Use code{" "}
            <span className="bg-lime-300 text-black px-2 py-0.2 rounded font-semibold">
              HAPPYHUGPAW
            </span>
            <br className="hidden md:block" /> for 10% OFF any order
          </h1>

          <Link
            to="/catalog"
            className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 bg-white text-black font-medium hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="Shop now and get 10% off"
          >
            Shop Now
          </Link>
        </div>

        <Link
          to="/catalog?coupon=HAPPYHUGPAW"
          aria-label="Take 10% off"
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2
                     [writing-mode:vertical-rl] rotate-180
                     bg-gray-200/95 hover:bg-gray-300 text-gray-800
                     px-3 py-2 rounded-r-md text-sm font-medium shadow"
        >
          Take 10%
        </Link>
      </div>
    </section>
  );
}
