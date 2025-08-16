import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ReviewGrid({
  title = "Review",
  subtitle = "Checkout what our HugPaw Community has to say",
  items = [],
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      {/* Heading + subheading */}
      <div className="mb-4 flex flex-col md:flex-row md:items-baseline md:gap-3">
        <h3 className="text-xl md:text-2xl font-semibold">{title}</h3>
        {subtitle ? (
          <p className="text-xs md:text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {items.map((r) => (
          <Card key={r.id} className="h-full rounded-2xl">
            <CardContent className="p-4 md:p-6">
              {/* Stars (optional) */}
              {typeof r.stars === "number" ? (
                <div
                  className="text-[10px] md:text-xs mb-1 md:mb-2"
                  aria-label={`${r.stars} stars`}
                >
                  {"★".repeat(r.stars)}
                  {"☆".repeat(Math.max(0, 5 - r.stars))}
                </div>
              ) : null}

              {/* Quote */}
              <p className="text-sm leading-relaxed">“{r.quote}”</p>

              {/* Author */}
              <div className="mt-3 md:mt-4 flex items-center gap-3">
                <Avatar className="h-8 w-8 md:h-9 md:w-9">
                  <AvatarImage src={r.avatarUrl} alt={r.name} />
                  <AvatarFallback>
                    {(r.name || "U")
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{r.name}</div>
                  {r.role ? (
                    <div className="text-muted-foreground">{r.role}</div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}