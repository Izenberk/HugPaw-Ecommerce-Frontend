import { Card, CardContent } from "@/components/ui/card";

export default function ReviewGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h3 className="text-2xl font-semibold">Review</h3>
      <p>Checkout What Our HugPaw Community has to say</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="h-full">
          <CardContent className="p-6">
            <div className="text-xs mb-2">★★★★★</div>
            <p className="text-sm">
              “I loved how easy it was to design Bella’s collar. The engraving
              is perfect, and the color matches her personality so well! She’s
              been getting compliments every walk.”
            </p>
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardContent className="p-6">
            <div className="text-xs mb-2">★★★★★</div>
            <p className="text-sm">
              “I loved how easy it was to design Bella’s collar. The engraving
              is perfect, and the color matches her personality so well! She’s
              been getting compliments every walk.”
            </p>
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardContent className="p-6">
            <div className="text-xs mb-2">★★★★★</div>
            <p className="text-sm">
              “I loved how easy it was to design Bella’s collar. The engraving
              is perfect, and the color matches her personality so well! She’s
              been getting compliments every walk.”
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
