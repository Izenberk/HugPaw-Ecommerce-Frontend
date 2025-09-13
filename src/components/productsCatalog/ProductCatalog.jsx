import { useEffect, useMemo, useState } from "react";
import CatalogToolbar from "@/components/productsCatalog/CatalogToolbar";
import ProductList from "@/components/productsCatalog/ProductList";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES, PRODUCTS_MOCK } from "@/data/productsCatalog.mock";
import { getProducts } from "@/lib/api";

export default function ProductCatalog({
  initialProducts = PRODUCTS_MOCK,
  fetcher = getProducts,
  defaultParams = { search: "", category: null, sort: "relevance" },
}) {
  const [products, setProducts] = useState(initialProducts ?? []); // wait to replace with fetcher
  const [isLoading, setIsLoading] = useState(!initialProducts);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(defaultParams); // for CatalogToolbar

  useEffect(() => {
    if (initialProducts) return; // using mock; filter client-side
    const ctrl = new AbortController();
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetcher({ signal: ctrl.signal, params });
        setProducts(normalizeProducts(data)); // server returns list; normalize for UI
      } catch (e) {
        if (e?.code !== "ERR_CANCELED") {
          setError({ message: e?.message ?? "Failed to load products" });
        }
      } finally {
        setIsLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [fetcher, params, initialProducts]);

  // Categories present in the current product set
  const categories = useMemo(() => {
    const present = new Set(products.map((p) => p.category).filter(Boolean));
    return CATEGORIES.filter((c) => present.has(c));
  }, [products]);

  // If using mock (initialProducts provided) -> filter client-side
  // If fetching from server -> results are already filtered by `params`
  const visibleProducts = useMemo(() => {
    const normalized = normalizeProducts(products);
    if (!initialProducts) return normalized; // client-side filter
    return applyFilterSort(normalized, params); // server-side filter
  }, [products, params, initialProducts]);

  return (
    <div className="space-y-6">
      <div className="w-full">
        <img
          src="/images/header/product-catalog-header.jpg"
          alt="Pet owner with dog and cat"
          className="w-full h-96 object-cover object-[center_35%] rounded-none"
        />
      </div>

      <header className="flex flex-col gap-2 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            At HugPaw, you can craft comfort, style, and tech just for your
            buddy
          </h1>
        </div>
        <div className="flex max-w-2xl">
          <CatalogToolbar
            params={params}
            onChange={setParams}
            categories={categories}
          />
        </div>
        <p className="text-sm text-muted-foreground">
            Take a look at our products
          </p>
      </header>
      <Separator />
      <ProductList
        products={visibleProducts}
        isLoading={isLoading}
        error={error}
      />
      {!isLoading && !error && (
        <p className="text-xs text-muted-foreground">
          {visibleProducts.length} item(s)
        </p>
      )}
    </div>
  );
}

/* ------------ helpers ------------- */

// 1) Normalize products (incl. tags)
function normalizeProducts(arr = []) {
  return arr.map((p) => {
    const imageUrl =
      p.imageUrl ??
      (Array.isArray(p.images) ? p.images[0] : undefined) ??
      p.thumbnailUrl ??
      "/images/placeholder-product.png";

    return {
      id: p.id ?? p._id ?? p.sku,
      name: p.name ?? p.title ?? "Untitled",
      price: toNumber(p.price ?? p.basePrice ?? p.pricing?.price ?? 0),
      imageUrl,
      description: p.description ?? p.summary ?? "",
      category: p.category ?? null,
      // ✅ force tags into a flat array of trimmed strings
      tags: normalizeTags(p.tags ?? p.attributes?.tags ?? []),
      customizeId: p.customizeId ?? null,
      customizable: Boolean(p.customizable),
    };
  });
}

function normalizeTags(x) {
  if (!Array.isArray(x)) return [];
  return x
    .map(String)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toNumber(v) {
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : 0;
}

function applyFilterSort(
  items,
  { search = "", category = null, sort = "relevance" } = {}
) {
  const q = search.trim();
  const tokens = parseQuery(q); // supports quoted phrases:  smart "bpa free"
  let out = items.filter((p) => {
    const okCategory =
      !category || category === "all" || norm(p.category) === norm(category);
    if (!okCategory) return false;
    if (!tokens.length) return true;
    return matchesSearch(p, tokens);
  });

  switch (sort) {
    case "price_asc":
      out.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      out.sort((a, b) => b.price - a.price);
      break;
    case "name_asc":
      out.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name_desc":
      out.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default: {
      // Optional: relevance weighting (name > tags > description)
      const score = (p) => {
        let s = 0;
        for (const t of tokens) {
          if (norm(p.name).includes(t)) s += 4;
          if ((p.tags ?? []).some((tag) => norm(tag).includes(t))) s += 3;
          if (norm(p.category).includes(t)) s += 2;
          if (norm(p.description).includes(t)) s += 1;
        }
        return s;
      };
      out.sort((a, b) => score(b) - score(a));
      break;
    }
  }
  return out;
}

// normalize strings: case/accents/hyphens/underscores → friendly matching
function norm(s = "") {
  return String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// parse query into tokens, supporting quoted phrases:  smart "bpa free"
function parseQuery(query = "") {
  const q = query.trim();
  if (!q) return [];
  const tokens = [];
  const re = /"([^"]+)"|(\S+)/g;
  let m;
  while ((m = re.exec(q))) {
    const token = m[1] || m[2];
    const n = norm(token);
    if (n) tokens.push(n);
  }
  return tokens;
}

// 2) Match tokens against haystack + individual tags
function matchesSearch(p, tokens) {
  const haystack = norm(
    [p.name, p.description, p.category, ...(p.tags ?? [])]
      .filter(Boolean)
      .join(" ")
  );
  return tokens.every((t) => {
    if (haystack.includes(t)) return true;
    // direct tag pass avoids accidental token merging issues
    return (p.tags ?? []).some((tag) => norm(tag).includes(t));
  });
}
