import toast from "react-hot-toast";

const toneVars = {
    brand:  { bg:"var(--toast-brand-bg)",  fg:"var(--toast-brand-fg)",  br:"var(--toast-brand-border)",  ctaBg:"var(--toast-brand-cta-bg)",  ctaFg:"var(--toast-brand-cta-fg)" },
    success:{ bg:"var(--toast-success-bg)",fg:"var(--toast-success-fg)",br:"var(--toast-success-border)",ctaBg:"var(--toast-success-cta-bg)",ctaFg:"var(--toast-success-cta-fg)" },
    warn:   { bg:"var(--toast-warn-bg)",   fg:"var(--toast-warn-fg)",   br:"var(--toast-warn-border)",   ctaBg:"var(--toast-warn-cta-bg)",   ctaFg:"var(--toast-warn-cta-fg)" },
    fav:    { bg:"var(--toast-fav-bg)",    fg:"var(--toast-fav-fg)",    br:"var(--toast-fav-border)",    ctaBg:"var(--toast-fav-cta-bg)",    ctaFg:"var(--toast-fav-cta-fg)" },
    error:  { bg:"var(--toast-error-bg)",  fg:"var(--toast-error-fg)",  br:"var(--toast-error-border)",  ctaBg:"var(--toast-error-cta-bg)",  ctaFg:"var(--toast-error-cta-fg)" },
};

export default function ToastCard({
    id,
    tone = "brand",
    icon = null,
    title,
    description,
    image,
    actionLabel,
    onAction,
    }) {
    const v = toneVars[tone] ?? toneVars.brand;

    return (
        <div
        className="flex items-center gap-3 rounded-xl p-4 shadow-lg border w-[min(92vw,420px)]"
        style={{ background: v.bg, color: v.fg, borderColor: v.br }}
        >
        {icon ? <div className="shrink-0 mt-0.5">{icon}</div> : null}

        {image ? (
            <img
            src={image}
            alt={title || "image"}
            className="shrink-0 w-10 h-10 rounded-md object-cover"
            />
        ) : null}

        <div className="flex-1 min-w-0">
            {title ? <p className="font-semibold truncate">{title}</p> : null}
            {description ? (
            <p className="text-sm/5 opacity-90 truncate">{description}</p>
            ) : null}
        </div>

        {actionLabel && onAction ? (
            <button
            onClick={() => { toast.dismiss(id); onAction(); }}
            className="ml-2 rounded-md px-3 py-1 text-sm font-medium hover:opacity-90"
            style={{ background: v.ctaBg, color: v.ctaFg }}
            >
            {actionLabel}
            </button>
        ) : null}
        </div>
    );
}
