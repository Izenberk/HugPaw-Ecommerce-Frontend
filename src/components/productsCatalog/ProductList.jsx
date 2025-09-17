// src/components/product/ProductList.jsx
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";
import ProductCard from "./ProductCard";
import { paths } from "@/app/paths";

export default function ProductList({
  products = [],
  isLoading = false,
  error = null,
}) {
  if (isLoading) return <SkeletonGrid />;

  if (error) {
    return (
      <Alert variant="destructive" role="alert" className="max-w-xl">
        <AlertTitle>Couldn't load products</AlertTitle>
        <AlertDescription>
          {error?.message ?? "Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  if (!products.length) return <EmptyState />;

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {products.map((raw) => {
        const p = normalizeProduct(raw);
        if (!p.id) return null;
        return (
          <div key={p.id} className="max-w-sm">
            <ProductCard
              id={p.id}
              name={p.name}
              price={p.price}
              imageUrl={p.imageUrl}
              description={p.description}
              to={paths.productDetail(p.id)}
              customizable={p.customizable}
              customizeId={p.customizeId}
              tags={p.tags}
            />
          </div>
        );
      })}
    </div>
  );
}

/** ---- Helpers ---- */

function normalizeProduct(input = {}) {
  const id = input.id ?? input._id ?? input.sku ?? null;

  const imageUrl =
    input.imageUrl ??
    (Array.isArray(input.images) ? input.images[0] : undefined) ??
    input.thumbnailUrl ??
    "/images/placeholder-product.png"; // note: public assets are served from root

  return {
    id,
    name: input.name ?? input.title ?? "Untitled",
    price: toNumber(
      input.price ?? input.basePrice ?? input.pricing?.price ?? 0
    ),
    imageUrl,
    description: input.description ?? input.summary ?? "",
    tags: input.tags ?? input.attributes?.tags ?? [],
  };
}

function toNumber(v) {
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : 0;
}

/** ---- UI bits ---- */

function SkeletonCard() {
  return (
    <div className="rounded-xl border p-4 space-y-4">
      <Skeleton className="w-full aspect-[4/3] rounded-lg" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

function SkeletonGrid({ count = 8 }) {
  return (
    <div className="mx-auto max-w-screen-xl px-4">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border p-10 text-center">
      <Info className="mb-2 opacity-60" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">No products found.</p>
    </div>
  );
}
