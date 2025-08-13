import { Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Skeleton } from "../ui/skeleton"
import ProductCard from "./ProductCard"

export default function ProductList({
    products = [],
    isLoading = false,
    error = null,
    linkPrefix = "/products",
}) {
    if (isLoading) return <SkeletonGrid />

    if (error) {
        return (
            <Alert variant="destructive" role="alert" className="max-w-xl">
                <AlertTitle>Couldn't load products</AlertTitle>
                <AlertDescription>{error?.message ?? "Please try again later."}</AlertDescription>
            </Alert>
        )
    }

    if (!products.length) return <EmptyState />

    return (
        <div className="grid gap-6 justify-center grid-cols-[repeat(auto-fit,minmax(16rem,24rem))] lg:mx-16">
            {products.map((p) => {
            const id = p.id ?? p._id
            return (
                <ProductCard
                key={id ?? p.sku ?? p.name}
                id={id}
                name={p.name}
                price={p.price}
                imageUrl={p.imageUrl}
                description={p.description}
                to={`${linkPrefix}/${id}`}
                tags={p.tags}
                />
            )
            })}
        </div>
    )
}

function SkeletonCard() {
    return (
        <div className="rounded-xl border p-4 space-y-4">
            <Skeleton className="w-full aspect-[4/3] rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full" />
        </div>
    )
}

function SkeletonGrid({ count = 8 }) {
    return (
        <div className="grid gap-6 justify-center grid-cols-[repeat(auto-fit,minmax(16rem,24rem))]">
        {Array.from({ length: count }, (_, i) => (
            <div key={i} className="rounded-xl border p-4 space-y-4">
            <Skeleton className="w-full aspect-[4/3] rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full" />
            </div>
        ))}
        </div>
    )
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border p-10 text-center">
            <Info className="mb-2 opacity-60" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">No products found.</p>
        </div>
    )
}