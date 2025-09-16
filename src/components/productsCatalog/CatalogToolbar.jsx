import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

const DEBOUNCE_MS = 300;
const SORTS = [
  { value: "default", label: "Default" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "name_asc", label: "Name: A → Z" },
  { value: "name_desc", label: "Name: Z → A" },
];

export default function CatalogToolbar({ params, onChange, categories = [] }) {
  const [searchDraft, setSearchDraft] = useState(params?.search ?? "");

  const searchParam = params?.search ?? "";
  useEffect(() => {
    setSearchDraft(searchParam);
  }, [searchParam]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchParam !== searchDraft) {
        onChange?.((prev) => ({ ...prev, search: searchDraft }));
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchDraft, searchParam, onChange]);

  const hasCategories = categories.length > 0;

  const isPristine =
    (params?.search ?? "") === "" &&
    (hasCategories ? (params?.category ?? null) === null : true) &&
    (params?.sort ?? "default") === "default";

  function reset() {
    onChange?.({
      search: "",
      category: hasCategories ? null : undefined,
      sort: "default",
    });
  }

  return (
    <div className="w-full rounded-xl p-3 sm:p-4 bg-background/60 backdrop-blur px-3 py-2 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
        {/* Search */}
        {/* <div className="space-y-1">
          <Label htmlFor="catalog-search" className="text-xs">
            Search
          </Label>
          <div className="relative">
            <Search
              className="absolute left-2 top-1/2 -translate-y-1/2 size-4 opacity-60"
              aria-hidden
            />
            <Input
              id="catalog-search"
              placeholder="Find products…"
              className="pl-8"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // commit immediately (skip debounce)
                  if (searchDraft !== (params?.search ?? "")) {
                    onChange?.((prev) => ({ ...prev, search: searchDraft }));
                  }
                }
              }}
            />
            {searchDraft && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setSearchDraft("")}
                aria-label="Clear search"
                title="Clear search"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div> */}

        {/* Category */}
        {hasCategories ? (
          <div className="space-y-1">
            <Label className="text-xs">Category</Label>
            <Select
              value={params?.category ?? "all"}
              onValueChange={(v) =>
                onChange?.((prev) => ({
                  ...prev,
                  category: v === "all" ? null : v,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="hidden sm:block" />
        )}

        {/* Sorting */}
        <div className="space-y-1">
          <Label className="text-xs">Sort</Label>
          <Select
            value={params?.sort ?? "default"}
            onValueChange={(v) => onChange?.((prev) => ({ ...prev, sort: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORTS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset */}
        <div className="space-y-1 sm:justify-self-end">
          {/* spacer label so vertical rhythm matches the other fields */}
          <Label className="text-xs opacity-0 select-none">Reset</Label>
          <Button
            size="sm"
            onClick={reset}
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 shadow-sm"
            disabled={isPristine}
            title="Reset filters"
          >
            <SlidersHorizontal className="mr-2 size-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
