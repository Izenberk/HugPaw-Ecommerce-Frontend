import { create } from "zustand";

function hashConfig(config) {
    try {
        return btoa(unescape(encodeURIComponent(JSON.stringify(config || {}))));
    } catch {
        return String(Date.now())
    }
}

const STORAGE_KEY = "hugpaw:favorites:v1";

function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

const persist = (set) => (fn) => set((state) => {
    const next = fn(state);
    // eslint-disable-next-line no-empty
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next.items)); } catch {}
    return next;
});

export const useFavorites = create((set, get) => ({
    items: load(),

    addFavorite: (payload) => {
        const {
            productId, name, imageUrl, price,
            bastPrice, basePrice, // accept either
            config, tags = []
        } = payload;

        const chosenPrice = Number(
            price ?? basePrice ?? bastPrice ?? 0
        );

        const id = `${productId}::${hashConfig(config)}`;
        const exists = get().items.some((it) => it.id === id);
        const withPersist = persist(set);
        if (exists) return id;

        withPersist((state) => ({
            ...state,
            items: [
            {
                id,
                productId,
                name,
                imageUrl,
                price: chosenPrice,      // cart-friendly
                basePrice: chosenPrice,  // normalized
                config: config || {},
                tags,
                createdAt: Date.now(),
            },
            ...state.items,
            ],
        }));
        return id;
    },

    removeFavorite: (id) => persist(set)((state) => ({
        ...state,
        items: state.items.filter((it) => it.id !== id),
    })),

    clearFavorites: () => persist(set)((state) => ({ ...state, items: [] })),

    moveToCart: (id, addToCart) => {
        const item = get().items.find((it) => it.id === id);
        if (!item || typeof addToCart !== "function") return false;
        addToCart({
            productId: item.productId,
            quantity: 1,
            config: item.config,
            unitPrice: item.price,            // Cart expects unitPrice
            name: item.name,                  // 👉 for cart UI
            imageUrl: item.imageUrl,          // 👉 for cart UI
            tags: item.tags,                  // optional
            meta: { from: "favorites", favoriteId: id },
        });
        get().removeFavorite(id);
        return true;
    },
}));