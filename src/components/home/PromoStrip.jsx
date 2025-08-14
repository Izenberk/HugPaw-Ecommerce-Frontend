import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";


export default function PromoStrip({ title, subtitle, cta }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <Card className="bg-gradient-to-r from-primary/40 to-primary/20">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            </div>
            <div className="justify-self-start md:justify-self-end">
              <Button asChild size="lg">
                <a href={cta.href}>{cta.label}</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
