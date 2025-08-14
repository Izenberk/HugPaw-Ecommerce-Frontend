import { Button } from "@/components/ui/button";

export default function HeroSplit ({ title, subtitle, cta, imageSrc, imageAlt }) {
  return (
  <section className="mx-auto max-w-6xl px-6 py-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-muted-foreground">{subtitle}</p>
        <div className="mt-6">
          <Button asChild size="lg"><a href={cta.href}>{cta.label}</a></Button>
        </div>
      </div>
      <div>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-[360px] md:h-[420px] object-cover rounded-xl"
        />
      </div>
    </div>
  </section>
);
}