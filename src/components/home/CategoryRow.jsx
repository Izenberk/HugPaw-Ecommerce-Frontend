import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function CategoryRow({
  items,
  ctaHref = "/catalog",
  ctaLabel = "Discover All Products",
}) {
  return (
    <section>
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-12 md:py-16">
        {/* Heading */}
        <div className="flex flex-col items-center text-center gap-2 mb-6 md:mb-8">
          <h2 className="title-text mb-2">Why HugPaw?</h2>
          <p className="subtitle-text max-w-2xl">
            Highest Functionality for Your Four-Legged Friend
          </p>
        </div>

        {/* ≥ sm : grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((it) => (
            <Card
              key={it.id}
              className="group rounded-2xl text-center h-full flex flex-col transition-shadow hover:shadow-md"
            >
              {/* คลิกที่รูปได้ */}
              <Link
                to={it.href}
                aria-label={`Open ${it.title}`}
                className="block w-full aspect-[4/3] relative rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {/* กรอบคงที่ + padding */}
                <div className="absolute inset-0 p-4">
                  {/* base + hover วางซ้อนกันเต็มกรอบ */}
                  <img
                    src={it.imageSrc}
                    alt={it.imageAlt ?? it.title}
                    width={800}
                    height={600} // กัน CLS ตาม aspect 4:3
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 opacity-100 group-hover:opacity-0 group-focus-within:opacity-0 pointer-events-none"
                    loading="lazy"
                  />
                  {it.imageHoverSrc && (
                    <img
                      src={it.imageHoverSrc}
                      alt={it.imageAlt ?? it.title}
                      width={800}
                      height={600}
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none"
                      loading="lazy"
                    />
                  )}
                </div>
              </Link>

              <CardHeader className="pt-0">
                <CardTitle className="text-lg font-semibold">
                  <Link
                    to={it.href}
                    className="hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
                  >
                    {it.title}
                  </Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{it.desc}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* < sm : horizontal scroll */}
        <div className="sm:hidden -mx-6 px-6 overflow-x-auto">
          <div className="flex gap-3 snap-x snap-mandatory">
            {items.map((it) => (
              <Card
                key={it.id}
                className="min-w-[260px] snap-start rounded-2xl text-center flex flex-col transition-shadow hover:shadow-md"
              >
                {/* คลิกที่รูปได้ */}
                <Link
                  to={it.href}
                  aria-label={`Open ${it.title}`}
                  className="block w-full aspect-[4/3] grid place-items-center p-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <img
                    src={it.imageSrc}
                    alt={it.imageAlt ?? it.title}
                    className="max-h-full object-contain"
                    loading="lazy"
                  />
                </Link>

                <CardHeader className="pt-0">
                  <CardTitle className="text-base">
                    <Link
                      to={it.href}
                      className="hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
                    >
                      {it.title}
                    </Link>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{it.desc}</p>
                </CardHeader>

                <CardContent className="mt-auto pb-4">
                  <Button asChild variant="lavenderblue" size="default">
                    <Link to={it.href} aria-label={`Customize ${it.title}`}>
                      Let’s Customize
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-10 md:mt-12 flex justify-center">
          <Link
            to="/catalog"
            className="primary-button"
            bg-blue-600
            text-white
            font-medium
            transition-all
            duration-300
          >
            Discover All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
