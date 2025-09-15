import { useMemo } from "react";

const PRESETS = {
  Collar: ["Kind","Type","Size","Color"],
  Dispenser: ["Kind","Type","Size","Color","Filtration","Pump & Hygiene","Power"],
  Feeder: ["Kind","Type","Size","Color","Power Mode","Smart Add-ons","Bowl Material"],
  "Smart Module": ["Kind","Type","Feature"],
  Addon: ["Kind","Type","Compatible With","Name"]
};

export default function AttributeEditor({ value = [], onChange, typeValue }) {
  const rows = Array.isArray(value) ? value : [];
  const keysForType = useMemo(() => {
    const list = PRESETS[typeValue] || [];
    // Always include selected keys + ensure uniqueness
    const existingKeys = [...new Set(rows.map(r => r.k).filter(Boolean))];
    return Array.from(new Set([...list, ...existingKeys]));
  }, [typeValue, rows]);

  function updateRow(i, patch) {
    const next = rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r));
    onChange?.(normalize(next));
  }
  function addRow(k = "", v = "") {
    onChange?.(normalize([...rows, { k, v }]));
  }
  function removeRow(i) {
    const next = rows.filter((_, idx) => idx !== i);
    onChange?.(normalize(next));
  }

  function normalize(list) {
    // trim + drop empties + dedupe by k keeping last non-empty
    const cleaned = list
      .map(x => ({ k: String(x?.k||"").trim(), v: String(x?.v||"").trim() }))
      .filter(x => x.k && x.v);
    const byKey = new Map();
    for (const x of cleaned) byKey.set(x.k, x);
    return Array.from(byKey.values());
  }

  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="w-48 rounded border px-2 py-1"
            list="attr-keys"
            value={row.k}
            onChange={e => updateRow(i, { k: e.target.value })}
            placeholder="Key (e.g., Type)"
          />
          <input
            className="flex-1 rounded border px-2 py-1"
            value={row.v}
            onChange={e => updateRow(i, { v: e.target.value })}
            placeholder="Value (e.g., Collar)"
          />
          <button
            type="button"
            className="rounded border px-2 text-sm hover:bg-red-50"
            onClick={() => removeRow(i)}
            aria-label="Remove attribute"
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

      {/* datalist for quick key selection */}
      <datalist id="attr-keys">
        {keysForType.map(k => <option key={k} value={k} />)}
      </datalist>
    </div>
  );
}
