// src/components/product/OptionGroup.jsx
import { useMemo } from "react";

export default function OptionGroup({ group, value, error, onPick, isSelectable }) {
    const labelCls = "text-sm font-medium";
    const helpCls = "text-xs text-muted-foreground";

    const options = useMemo(() => group.values || [], [group.values]);

    return (
        <div>
        <div className="mb-2 flex items-center gap-2">
            <span className={labelCls}>{group.label}</span>
            {group.required && <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100">Required</span>}
            {error && <span className="text-xs text-red-500">• required</span>}
        </div>

        <div className="flex flex-wrap gap-2">
            {options.map((v) => {
            const active = group.type === "single"
                ? value === v.value
                : Array.isArray(value) && value.includes(v.value);

            const selectable = isSelectable ? isSelectable(group.key, v.value) : true;

            // allow unselect even if now not selectable
            const disabled = (!selectable && !active) || v.disabled;

            const base = "px-3 py-1.5 rounded-lg border hover:cursor-pointer hover:border-primary-foreground";
            const cls = disabled
                ? `${base} opacity-40 cursor-not-allowed`
                : active ? `${base} bg-black text-white` : `${base} hover:bg-muted`;

            return (
                <button
                key={v.value}
                disabled={disabled}
                onClick={() => !disabled && onPick(v.value)}
                className={cls}
                title={v.label}
                type="button"
                >
                {group.ui === "swatch" && v.swatch && (
                    <span className="inline-block w-4 h-4 rounded mr-2 align-middle" style={{ background: v.swatch }} />
                )}
                <span className="align-middle">{v.label}</span>
                {typeof v.priceAdj === "number" && v.priceAdj !== 0 && (
                    <span className="ml-2 text-xs opacity-70">
                    ({v.priceAdj > 0 ? "+" : ""}{v.priceAdj})
                    </span>
                )}
                </button>
            );
            })}
        </div>

        {group.help && <p className={helpCls}>{group.help}</p>}
        </div>
    );
}
