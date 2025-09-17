import { useMemo } from "react";

const PRESETS = {
  Collar: ["Type","Size","Color"],
  Dispenser: ["Type","Size","Color","Filtration","Pump & Hygiene","Power"],
  Feeder: ["Type","Size","Color","Power Mode","Smart Add-ons","Bowl Material"],
  "Smart Module": ["Type","Feature"],
  Addon: ["Type","Compatible With","Name"],
};

export default function AttributeEditor({ value = [], onChange, typeValue }) {
  const rows = Array.isArray(value) ? value : [];

  const keysForType = useMemo(() => {
    const list = PRESETS[typeValue] || [];
    const existing = [...new Set(rows.map(r => r.k).filter(Boolean))];
    return Array.from(new Set([...list, ...existing]));
  }, [typeValue, rows]);

  function updateRow(i, patch) {
    const next = rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r));
    // IMPORTANT: do NOT normalize here; keep empty rows visible
    onChange?.(next);
  }

  function addRow(k = "", v = "") {
    const next = [...rows, { k, v }];
    onChange?.(next);
  }

  function removeRow(i) {
    const next = rows.filter((_, idx) => idx !== i);
    onChange?.(next);
  }

  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="w-48 rounded border px-2 py-1"
            list="attr-keys"
            value={row.k ?? ""}
            onChange={e => updateRow(i, { k: e.target.value })}
            placeholder="Key (e.g. Type)"
          />
          <input
            className="flex-1 rounded border px-2 py-1"
            value={row.v ?? ""}
            onChange={e => updateRow(i, { v: e.target.value })}
            placeholder="Value (e.g. Collar)"
          />
          <button
            type="button"
            className="rounded border px-2 text-sm hover:bg-red-50"
            onClick={() => removeRow(i)}
          >
            Remove
          </button>
        </div>
      ))}

      <div>
        <button
          type="button"
          className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
          onClick={() => addRow("", "")}
        >
          + Add attribute
        </button>
      </div>

      <datalist id="attr-keys">
        {keysForType.map(k => <option key={k} value={k} />)}
      </datalist>
    </div>
  );
}
