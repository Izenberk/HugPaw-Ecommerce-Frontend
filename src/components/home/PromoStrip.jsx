import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // ไม่ใช้ก็ลบได้

export default function PromoStrip({ title, subtitle, cta, badge }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-6 md:py-10">
      <Card className="rounded-xl bg-primary/20 md:bg-gradient-to-r md:from-primary/40 md:to-primary/20">
        <CardContent className="p-4 md:p-8">
          {/* mobile = flex แถวเดียว, desktop = grid 1fr + auto */}
          <div className="flex items-start justify-between gap-3 md:grid md:grid-cols-[1fr_auto] md:items-center">
            <div>
              {badge ? (
                <div className="mb-1">
                  <Badge variant="secondary" className="text-[11px]">{badge}</Badge>
                </div>
              ) : null}
              <h3 className="text-base md:text-xl font-semibold">{title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{subtitle}</p>
            </div>

            {/* ปุ่ม: มือถือเล็ก, เดสก์ท็อปใหญ่ขึ้น */}
            <Button asChild className="h-8 px-3 md:h-11 md:px-8">
              <a href={cta.href}>{cta.label}</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
