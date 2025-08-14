import { Button } from "@/components/ui/button";

export default function HeroSplit() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-6 lg:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold">
            More Than Pets <br/> -They’re Family
          </h1>
          <p className="mt-4 text-muted-foreground">
            Create unique items for your furry friends
          </p>
          <Button className="mt-6">Shop Now</Button>
        </div>
        <div>
          <img
            src="/src/assets/images/home/pet-owner.png"
            alt="Pets and Owner"
            className="w-full h-[320px] md:h-[400px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}