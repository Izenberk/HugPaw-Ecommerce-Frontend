import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CategoryRow({ title, subtitle, items }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {/* desktop grid */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((it) => (
          <Card key={it.id} className="h-full">
            <CardHeader>
              <img
                src={it.imageSrc}
                alt={it.imageAlt}
                className="h-48 w-96 object-cover"
              />
              <CardTitle className="text-lg">{it.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{it.desc}</p>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href={it.href}>Let’s Customize</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* mobile horizontal scroll */}
      <div className="sm:hidden -mx-6 px-6 overflow-x-auto">
        <div className="flex gap-3 snap-x snap-mandatory">
          {items.map((it) => (
            <Card key={it.id} className="min-w-[240px] snap-start">
              <CardHeader>
                <CardTitle className="text-base">{it.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{it.desc}</p>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href={it.href}>Let’s Customize</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
