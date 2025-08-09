/* eslint-disable no-unused-vars */
import { Clock, Heart, Shield, Truck } from "lucide-react"

const ITEMS = [
    {key:"favorites", label:"Favorites", Icon: Heart },
    {key:"orders", label:"Orders", Icon: Truck},
    {key:"warranty", label:"Warranty", Icon: Shield},
    {key:"history", label:"History", Icon: Clock},
];

export default function ActionTabs({ value, onChange }) {
    return (
        <nav
        role="tablist"
        aria-label="User sections"
        className="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-2"
        >
        {ITEMS.map(({ key, label, Icon }) => {
            const active = value === key;
            const tabId = `tab-${key}`;
            const panelId = `panel-${key}`;
            return (
            <button
                key={key}
                id={tabId}
                role="tab"
                type="button"
                aria-selected={active}
                aria-controls={panelId}
                tabIndex={active ? 0 : -1}
                onClick={() => onChange(key)}
                className={`flex items-center gap-2 rounded-lg border border-border px-4 py-3
                ${active ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent"}
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
            >
                <Icon className="w-4 h-4" aria-hidden />
                <span>{label}</span>
            </button>
            );
        })}
        </nav>
    );
}
