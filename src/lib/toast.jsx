/* eslint-disable react-refresh/only-export-components */
import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** ---- Config knobs ---- */
const DEFAULT_DURATION = 3000;
const SWIPE_DISMISS_PX = 80; // how far to fling to dismiss
const MAX_SHOWN = 4;

/** Simple theme per variant */
function themeFor(variant) {
    switch (variant) {
        case "success": // green card, white button with green text
        return {
            bg: "#16a34a", fg: "#ffffff", ring: "#059669",
            btnBg: "#ffffff", btnFg: "#166534", btnBorder: "rgba(0,0,0,0.15)",
            btnHoverBg: "#f1f5f9",
        };
        case "error": // red card, white button with red text
        return {
            bg: "#dc2626", fg: "#ffffff", ring: "#b91c1c",
            btnBg: "#ffffff", btnFg: "#991b1b", btnBorder: "rgba(0,0,0,0.15)",
            btnHoverBg: "#fee2e2",
        };
        case "warn":
        case "warning": // amber card, dark text, white button with amber text
        return {
            bg: "#f59e0b", fg: "#111827", ring: "#d97706",
            btnBg: "#ffffff", btnFg: "#92400e", btnBorder: "rgba(0,0,0,0.15)",
            btnHoverBg: "#fff7ed",
        };
        case "info":
        default: // brand primary card, white button with brand text
        return {
            bg: "var(--primary)", fg: "var(--primary-foreground)", ring: "rgba(0,0,0,0.12)",
            btnBg: "#ffffff", btnFg: "var(--primary-foreground)", btnBorder: "rgba(0,0,0,0.12)",
            btnHoverBg: "#f8fafc",
        };
    }
}


/** Store */
const useToastStore = create((set, get) => ({
    toasts: [],
    add(toast) {
        const id = toast.id ?? uuid();
        const t = { id, duration: DEFAULT_DURATION, ...toast };
        set((s) => ({ toasts: [t, ...s.toasts] }));
        if (t.duration !== Infinity) {
        setTimeout(() => get().remove(id), t.duration);
        }
        return id;
    },
    remove(id) {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    },
    clear() {
        set({ toasts: [] });
    },
}));

/**
 * showToast(variant, {
 *   icon, title, description,
 *   action?: {
 *     label: string,
 *     to?: string,          // ← "/cart" or "https://…"
 *     onClick?: () => void, // custom handler (wins over `to` if provided)
 *     target?: "_blank",    // for external links
 *     icon?: ReactNode
 *   }
 * }, { duration, id })
 */
export function showToast(variant = "info", payload = {}, opts = {}) {
    const {
        icon,
        image,                // legacy thumbnail
        title,
        description,
        action,               // new shape: { label, to|onClick, ... }
        actionLabel,          // legacy
        onAction,             // legacy
        to, target,           // optional direct props
        ...rest
    } = payload || {};
    const { duration } = opts || {};

    // Build icon node
    const iconNode =
        icon ??
        (image ? <img src={image} alt="" className="h-5 w-5 rounded object-cover" /> : null);

    // Build action object
    const actionObj =
        action ??
        (actionLabel || onAction || to
        ? { label: actionLabel ?? "Open", onClick: onAction, to, target }
        : undefined);

    return useToastStore
        .getState()
        .add({ variant, icon: iconNode, title, description, action: actionObj, duration, ...rest });
}


export function dismissToast(id) {
    useToastStore.getState().remove(id);
}

/** ---- Internal: one Toast card ---- */
function ToastCard({ t, onRemove, dimmed }) {
    const controls = useAnimation();
    const navigate = useNavigate();
    const theme = themeFor(t.variant);

    // entrance animation
    useEffect(() => {
        controls.start({ opacity: 1, y: 0, scale: 1 });
    }, [controls]);

    const onAction = () => {
        // dismiss first for crisp feel
        onRemove(t.id);
        const run = () => {
        if (typeof t.action?.onClick === "function") {
            t.action.onClick();
            return;
        }
        const to = t.action?.to;
        if (!to) return;
        // external vs internal
        const isExternal = /^https?:\/\//i.test(to);
        if (isExternal) {
            if (t.action?.target === "_blank") {
            window.open(to, "_blank", "noopener");
            } else {
            window.location.href = to;
            }
        } else {
            navigate(to);
        }
        };
        // brief delay lets the exit animation play
        setTimeout(run, 20);
    };

    return (
        <motion.div
            layout
            // NOTE: switch items-start -> items-stretch so the right column can center itself vertically
            className={`pointer-events-auto relative w-[min(92vw,380px)] rounded-xl border shadow-md
                        p-3 sm:p-3.5 flex items-stretch gap-3 ${dimmed ? "opacity-70" : ""}`}
            style={{ background: theme.bg, color: theme.fg, borderColor: theme.ring }}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={controls}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.7 }}
            drag="x"
            dragElastic={0.2}
            onDragEnd={async (_e, info) => { /* unchanged */ }}
            >
            {/* Left: icon */}
            <div className="mt-0.5 shrink-0">{t.icon ?? null}</div>

            {/* Middle: text */}
            <div className="min-w-0 flex-1">
                {t.title && <div className="text-sm font-semibold">{t.title}</div>}
                {t.description && (
                <div className="mt-0.5 text-xs opacity-90 break-words">{t.description}</div>
                )}
            </div>

            {/* Right: controls (vertically centered) */}
            <div className="shrink-0 self-stretch flex items-center justify-center gap-2">
                {(t.action && (t.action.label || t.action.onClick || t.action.to)) && (
                <button
                    type="button"
                    onClick={onAction}
                    className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium
                            hover:opacity-100 active:opacity-90 focus-visible:outline-none focus-visible:ring-2 transition"
                    style={{
                    background: theme.btnBg,
                    color: theme.btnFg,
                    borderColor: theme.btnBorder,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = theme.btnHoverBg)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = theme.btnBg)}
                >
                    {t.action?.icon ?? null}
                    {t.action?.label ?? "Open"}
                </button>
                )}

                <button
                    onClick={() => onRemove(t.id)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:opacity-90"
                    aria-label="Dismiss"
                    type="button"
                    style={{ color: theme.fg }}
                    title="Dismiss"
                    >
                    <X size={16} />
                </button>
            </div>
        </motion.div>

    );
}

/** ---- Viewport (top-center) ---- */
export function ToastViewport() {
    const { toasts, remove } = useToastStore();
    const shown = toasts.slice(0, MAX_SHOWN);
    const queuedCount = Math.max(0, toasts.length - shown.length);

    return (
        <div
        aria-live="polite"
        className="
            pointer-events-none fixed z-[9999]
            top-6 left-1/2 -translate-x-1/2
            flex flex-col gap-2 items-stretch
        "
        >
        <AnimatePresence initial={false}>
            {shown.map((t, idx) => (
            <ToastCard key={t.id} t={t} onRemove={remove} dimmed={idx >= 2} />
            ))}
        </AnimatePresence>

        {queuedCount > 0 && (
            <motion.div
            key="queue-pill"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 0.9, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.7 }}
            className="mx-auto pointer-events-auto select-none mt-1 rounded-full border px-3 py-1 text-xs"
            style={{ background: "rgba(17,17,17,0.6)", color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}
            title={`${queuedCount} more in queue`}
            >
            +{queuedCount} more
            </motion.div>
        )}
        </div>
    );
}
