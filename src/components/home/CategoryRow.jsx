import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";


export default function CategoryRow({ title, subtitle, items }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
     {/* Heading */}
<div className="mb-6 flex flex-col md:flex-row md:items-baseline md:gap-3 items-center text-center md:text-left">
  <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
  {subtitle ? (
    <p className="text-xs md:text-sm text-muted-foreground">{subtitle}</p>
  ) : null}
</div>


      {/* Desktop grid */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((it) => (
          <Card key={it.id} className="rounded-2xl text-center">
            {/* รูปอยู่บนสุดของการ์ด */}
            <img
              src={it.imageSrc}
              alt={it.imageAlt ?? it.title}
              className="w-full h-40 object-contain p-4"
            />
            <CardHeader className="pt-0">
              <CardTitle className="text-lg">{it.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{it.desc}</p>
            </CardHeader>
            <CardContent className="pb-5">
              <Button asChild className="w-full">
                <a href={it.href}>Let’s Customize</a>
                {/* <Link to={it.href}>Let’s Customize</Link> */}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile horizontal scroll */}
      <div className="sm:hidden -mx-6 px-6 overflow-x-auto">
        <div className="flex gap-3 snap-x snap-mandatory">
          {items.map((it) => (
            <Card
              key={it.id}
              className="min-w-[240px] snap-start rounded-2xl text-center"
            >
              <img
                src={it.imageSrc}
                alt={it.imageAlt ?? it.title}
                className="w-full h-36 object-contain p-4"
              />
              <CardHeader className="pt-0">
                <CardTitle className="text-base">{it.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{it.desc}</p>
              </CardHeader>
              <CardContent className="pb-4">
                <Button asChild className="w-full">
                  <a href={it.href}>Let’s Customize</a>
                  {/* <Link to={it.href}>Let’s Customize</Link> */}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
