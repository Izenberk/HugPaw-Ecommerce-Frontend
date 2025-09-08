// src/components/product/ReadMore.jsx
import { useState } from "react";

export default function ReadMore({ text, initialLines = 3 }) {
    const [open, setOpen] = useState(false);
    const cls = open ? "" : `line-clamp-${initialLines}`;
    return (
        <div>
        <p className={`text-sm text-muted-foreground ${cls}`}>{text}</p>
        {text?.length > 120 && (
            <button
            onClick={() => setOpen(v => !v)}
            className="mt-1 text-xs underline hover:cursor-pointer hover:opacity-70"
            type="button"
            >
            {open ? "Read less" : "Read more"}
            </button>
        )}
        </div>
    );
}
