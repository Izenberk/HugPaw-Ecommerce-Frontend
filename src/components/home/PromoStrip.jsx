import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PromoStrip({
  title,
  subtitle,
  cta, // { href: string; label: string }
  badge, // string | undefined
}) {
  return (
    <section className="bg-[#fbfbfb]                 /* mobile default */
        lg:bg-gradient-to-r          /* desktop gradient */
        lg:from-[#fbfbfb]
        lg:via-[#e6eefe]
        lg:to-[#ffedcb]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-10 md:py-12">
        <Card className="rounded-xl">
          <CardContent className="p-6 md:p-8">
            {/* mobile = stack; desktop = 3fr / 2fr */}
            <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] items-center gap-4 md:gap-6 min-h-[112px]">
              {/* left: text */}
              <div className="text-center md:text-left mx-auto md:mx-0 max-w-[60ch]">
                {/* --- Mobile: Badge + Title (2 lines) + Subtitle --- */}
                <div className="md:hidden mb-2">
                  {badge ? (
                    <div className="mb-1">
                      <Badge variant="secondary" className="text-[11px]">
                        {badge}
                      </Badge>
                    </div>
                  ) : null}

                  <h3 className="text-lg font-semibold leading-snug">
                    <span className="block">{title}</span>
                  </h3>

                  {subtitle ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {subtitle}
                    </p>
                  ) : null}
                </div>

                {/* --- Desktop: Badge + Title (full) + Subtitle --- */}
                <div className="hidden md:block">
                  {badge ? (
                    <div className="mb-1">
                      <Badge variant="secondary" className="text-[11px]">
                        {badge}
                      </Badge>
                    </div>
                  ) : null}

                  <h3 className="text-xl font-semibold leading-snug">
                    {title}
                  </h3>

                  {subtitle ? (
                    <p className="text-base text-muted-foreground">
                      {subtitle}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* right: CTA container */}
              <div className="flex w-full md:w-auto justify-center items-center">
                <Button
                  asChild
                  size={"lg"}
                  variant={"lavenderblue"}
                >
                  <a href={cta.href} aria-label={cta.label}>
                    {cta.label}
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
