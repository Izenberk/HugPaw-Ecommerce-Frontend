import CatalogToolbar from "@/components/products/CatalogToolbar";
import ProductList from "@/components/products/ProductList";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES, PRODUCTS_MOCK } from "@/data/products.mock";
import { getProducts } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";

export default function ProductCatalog({
    initialProducts={PRODUCTS_MOCK},
    fetcher = getProducts,
    defaultParams = { search: "", category: null, sort: "relevance" },
}) {
    const [products, setProducts] = useState(initialProducts ?? [])
    const [isLoading, setIsLoading] = useState(!initialProducts)
    const [error, setError] = useState(null)
    const [params, setParams] = useState(defaultParams) // for CatalogToolbar

    useEffect(() => {
        if (initialProducts) return
        const ctrl = new AbortController()
        async function load() {
            setIsLoading(true)
            setError(null)
            try {
                const data = await fetcher({ signal: ctrl.signal, params })
                setProducts(normalizeProducts(data))
            } catch (e) {
                if (e?.code !== "ERR_CANCELED") setError({ message: e?.message ?? "Failed to load products" })
            } finally {
                setIsLoading(false)
            }
        }
        load()
        return () => ctrl.abort()
    }, [fetcher, params, initialProducts])

    // Categories
    const categories = useMemo(() => {
        const present = new Set(products.map(p => p.category).filter(Boolean))
        return CATEGORIES.filter(c => present.has(c))
    }, [products])

    const visibleProducts = useMemo(() => {
        if (!initialProducts) return products
        return applyFilterSort(products, params)
    }, [products, params, initialProducts])

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            <header className="flex flex-col gap-2 items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">At HugPaw, you can craft comfort, style, and tech just for your buddy</h1>
                    <p className="text-sm text-muted-foreground">Take a look at our products</p>
                </div>
                <div className="flex max-w-2xl">
                    <CatalogToolbar params={params} onChange={setParams} categories={categories}/>
                </div>
            </header>

            <Separator />

            <ProductList products={visibleProducts} isLoading={isLoading} error={error} />

            {!isLoading && !error && (
                <p className="text-xs text-muted-foreground">{products.length} item(s)</p>
            )}
        </div>
    )
}

function normalizeProducts(arr = []) {
    return arr.map((p) => ({
        id: p.id ?? p._id ?? p.sku,
        name: p.name ?? p.title ?? "Untitled",
        price: toNumber(p.price ?? p.pricing?.price ?? 0),
        imageUrl: p.imageUrl ?? p.image ?? p.thumbnailUrl ?? "/placeholder-product.png",
        description: p.description ?? p.summary ?? "",
        category: p.category ?? null,
        tags: p.tags ?? p.attributes?.tags ?? [],
    }))
}

function toNumber(v) {
    const n = typeof v === "string" ? Number(v) : v
    return Number.isFinite(n) ? n : 0
}

function applyFilterSort(items, { search = "", category = null, sort = "relevance" } = {}) {
    const q = search.trim()

    let out = items.filter((p) => {
        const okCategory = !category || category === "all" || norm(p.category) === norm(category)
        if (!okCategory) return false
        if (!q) return true
        return matchesSearch(p, q)
    })

    switch (sort) {
        case "price_asc":
        out.sort((a, b) => a.price - b.price); break
        case "price_desc":
        out.sort((a, b) => b.price - a.price); break
        case "name_asc":
        out.sort((a, b) => a.name.localeCompare(b.name)); break
        case "name_desc":
        out.sort((a, b) => b.name.localeCompare(a.name)); break
        default:
        // 'relevance' keeps current order
        break
    }
    return out
}

function norm(s = "") {
    return String(s)
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[-_/]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
}

function matchesSearch(p, query) {
    const haystack = norm(
        [
            p.name,
            p.description,
            p.category,
            ...(Array.isArray(p.tags) ? p.tags : []),
        ].filter(Boolean).join(" ")
    )

    const tokens = norm(query).split(" ")
    return tokens.every((t) => haystack.includes(t))
}