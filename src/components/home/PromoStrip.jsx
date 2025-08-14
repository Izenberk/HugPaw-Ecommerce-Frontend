import { Button } from "@/components/ui/button";

export default function PromoStrip() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-8 bg-accent">
      <div className="bg-primary/20 rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">
            20% Off Your First Custom Pet Product
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Design the perfect item for your friend today and enjoy free
            shipping on your first order.
          </p>
        </div>
        <Button asChild size="lg">
          <a href="#">Claim Your Discount</a>
        </Button>
      </div>
    </section>
  );
}
