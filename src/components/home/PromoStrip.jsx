import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PromoStrip({ title, subtitle, cta, badge }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-6 md:py-10">
      {/* mobile = solid bg, desktop = gradient */}
      <Card className="rounded-xl bg-primary/20 md:bg-gradient-to-r md:from-primary/40 md:to-primary/20 md:bg-none">
        <CardContent className="p-3 md:p-8">
          {/* mobile: stack col, desktop: grid */}
          <div className="flex flex-col items-center gap-3 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-0">
            {/* ข้อความ */}
            <div className="text-center md:text-left mx-auto md:mx-0">
              {/* badge เฉพาะ desktop */}
              {badge ? (
                <div className="hidden md:block mb-1">
                  <Badge variant="secondary" className="text-[11px]">
                    {badge}
                  </Badge>
                </div>
              ) : null}

              <h3 className="text-sm font-semibold leading-tight md:text-xl md:leading-snug">
                {title}
              </h3>

              {/* subtitle: desktop only */}
              <p className="hidden md:block text-sm text-muted-foreground mt-1">
                {subtitle}
              </p>
            </div>

            {/* ปุ่ม */}
            <div className="flex justify-center md:justify-end w-full md:w-auto">
              <Button
                asChild
                className="h-8 px-3 rounded-full md:h-11 md:px-8 md:rounded-lg"
              >
                <a href={cta.href}>{cta.label}</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
