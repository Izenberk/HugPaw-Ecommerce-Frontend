/* eslint-disable no-unused-vars */
import { Clock, Heart, Shield, Truck } from "lucide-react"

const ITEMS = [
    { key: "favorites", label: "Favorites", Icon: Heart, enabled: true },
    { key: "orders",    label: "Orders",    Icon: Truck, enabled: false },
    { key: "warranty",  label: "Warranty",  Icon: Shield, enabled: false },
    { key: "history",   label: "History",   Icon: Clock, enabled: false },
];

export default function ActionTabs({ value = "favorites", onChange }) {
    return (
        <nav
        role="tablist"
        aria-label="User sections"
        className="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-2"
        >
        {ITEMS.map(({ key, label, Icon, enabled }) => {
            const active = value === key && enabled;

            const base =
            "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors";
            const enabledClasses = active
            ? "bg-primary text-primary-foreground border-transparent"
            : "border-border hover:bg-muted";
            const disabledClasses =
            "border-dashed border-border bg-muted/30 text-muted-foreground cursor-not-allowed opacity-70";

            return (
            <button
                key={key}
                role="tab"
                aria-selected={active}
                aria-disabled={!enabled}
                // Use disabled to block clicks; if you want a tooltip later, drop disabled and keep aria-disabled only.
                disabled={!enabled}
                onClick={() => enabled && onChange?.(key)}
                className={`${base} ${enabled ? enabledClasses : disabledClasses}`}
                title={enabled ? label : "Coming soon"}
            >
                <Icon className="size-4" aria-hidden="true" />
                <span className="truncate">{label}</span>
                {!enabled && (
                <span className="ml-auto rounded-full border border-border px-1.5 py-0.5 text-[10px] leading-none">
                    soon
                </span>
                )}
            </button>
            );
        })}
        </nav>
    );
}
