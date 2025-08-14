import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CategoryRow() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 bg-primary">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Our Products</h2>
        <p className="text-sm text-muted-foreground"></p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="text-center">
          <img
            src="/src/assets/images/products/collar.jpg"
            alt="Pet Collar"
            className="w-full h-48 object-contain p-4"
          />
          <CardHeader>
            <CardTitle>Collar</CardTitle>
            <p className="text-sm text-muted-foreground">
              More than just a collar-It's their identity
            </p>
          </CardHeader>
          <CardContent className="flex justify-center mt-auto">
            <Button variant="black" asChild>
              <a href="#">Let’s Customize</a>
            </Button>
          </CardContent>
        </Card>
        <Card className="text-center">
          <img
            src="/src/assets/images/products/water-dispenser.jpg"
            alt="Water Dispenser"
            className="w-full h-48 object-contain p-4"
          />
          <CardHeader>
            <CardTitle>Water Dispenser</CardTitle>
            <p className="text-sm text-muted-foreground">
              Their wellness starts with water
            </p>
          </CardHeader>
          <CardContent className="flex justify-center mt-auto">
            <Button variant="black" asChild>
              <a href="#">Let’s Customize</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <img
            src="/src/assets/images/products/feeder.jpg"
            alt="Feeder"
            className="w-full h-48 object-contain p-4"
          />
          <CardHeader>
            <CardTitle>Feeder</CardTitle>
            <p className="text-sm text-muted-foreground">
              Mealtime made personal
            </p>
          </CardHeader>
          <CardContent className="flex justify-center mt-auto">
            <Button variant="black" asChild>
              <a href="#">Let’s Customize</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
