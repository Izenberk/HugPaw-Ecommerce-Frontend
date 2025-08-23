import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function CategoryRow({ title, subtitle, items }) {
  return (
    <section className="">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-12 md:py-16">
        {/* Heading */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-3 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
          {subtitle ? (
            <p className="text-base text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {/* ≥ sm : grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((it) => (
            <Card
              key={it.id}
              className="rounded-2xl text-center h-full flex flex-col transition-shadow hover:shadow-md"
            >
              {/* lock aspect + contain image */}
              <div className="w-full aspect-[4/3] grid place-items-center p-4">
                <img
                  src={it.imageSrc}
                  alt={it.imageAlt ?? it.title}
                  className="max-h-full object-contain"
                  loading="lazy"
                />
              </div>

              <CardHeader className="pt-0">
                <CardTitle className="text-lg font-semibold">
                  {it.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{it.desc}</p>
              </CardHeader>

              {/* push CTA to bottom so all cards equal height */}
              <CardContent className="mt-auto pb-5">
                <Button
                  asChild
                  className="h-10 px-4 text-sm rounded-lg w-full md:w-auto focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <Link to={it.href} aria-label={`Customize ${it.title}`}>
                    Let’s Customize
                  </Link>
                </Button>
              </CardContent>
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
                <div className="w-full aspect-[4/3] grid place-items-center p-4">
                  <img
                    src={it.imageSrc}
                    alt={it.imageAlt ?? it.title}
                    className="max-h-full object-contain"
                    loading="lazy"
                  />
                </div>

                <CardHeader className="pt-0">
                  <CardTitle className="text-base">{it.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{it.desc}</p>
                </CardHeader>

                <CardContent className="mt-auto pb-4">
                  <Button asChild className="h-10 w-full text-sm">
                    <Link to={it.href} aria-label={`Customize ${it.title}`}>
                      Let’s Customize
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
