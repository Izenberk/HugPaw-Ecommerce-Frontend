// src/admin/components/ItemForm.jsx
import { useEffect, useState } from "react";
import AttributeEditor from "./AttributeEditor.jsx";
import { buildSku, getAttr } from "../utils/sku.js";

export default function ItemForm({ open, onClose, onSubmit, initial }) {
  const [sku, setSku] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [unitPrice, setUnitPrice] = useState(0);
  const [stockAmount, setStockAmount] = useState(0);
  const [status, setStatus] = useState("active");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!open) return;
    setSku(String(initial?.sku || ""));
    // use attributes array as-is
    setAttributes(Array.isArray(initial?.attributes) ? initial.attributes : []);
    // map basePrice -> unitPrice if present
    setUnitPrice(Number(
      initial?.unitPrice ?? initial?.basePrice ?? 0
    ));
    setStockAmount(Number(initial?.stockAmount ?? 0));
    setStatus(initial?.status || "active");
    setImageUrl(String(initial?.imageUrl || ""));
  }, [open, initial]);

  const typeValue = getAttr(attributes, "Type");

  function regenerateSku() {
    const s = buildSku(attributes);
    if (s) setSku(s);
  }

  function submit(e) {
    e.preventDefault();

    const cleanAttrs = normalizeAttributes(attributes);
    // if user picked a Type in the quick selector but removed it in the editor,
    // keep what’s in the editor (no hard enforcement)
    const payload = {
      sku: String(sku).trim().toUpperCase(),
      attributes: cleanAttrs,
      unitPrice: Number(unitPrice),
      stockAmount: Number(stockAmount),
      status,
      imageUrl,
    };

    onSubmit?.(payload);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{initial ? "Edit Item" : "New Item"}</h3>
          <button className="rounded px-2 py-1 text-sm hover:bg-gray-100" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Quick selector for Type only (schema uses attributes for everything) */}
          <div>
            <label className="mb-1 block text-sm">Type</label>
            <input
              className="w-full rounded border px-2 py-1"
              list="item-type"
              value={typeValue}
              onChange={e => setAttributes(patchAttr(attributes, "Type", e.target.value))}
              placeholder="Collar / Dispenser / Feeder / Smart Module"
            />
            <datalist id="item-type">
              <option value="Collar" />
              <option value="Dispenser" />
              <option value="Feeder" />
              <option value="Smart Module" />
            </datalist>
          </div>

          {/* Attributes */}
          <div>
            <label className="mb-1 block text-sm">Attributes</label>
            <AttributeEditor
              value={attributes}
              onChange={setAttributes}
              typeValue={typeValue}
            />
            <p className="mt-1 text-xs text-gray-500">
              Examples: Size=XS, Color=Black · Dispenser-only: Filtration=Standard Charcoal, Pump & Hygiene=Ultra Quiet Pump, Power=USB-C
            </p>
          </div>

          {/* Price / Stock / Status */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm">Unit Price (THB)</label>
              <input
                type="number"
                min="0"
                step="1"
                className="w-full rounded border px-2 py-1"
                value={unitPrice}
                onChange={e => setUnitPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Stock</label>
              <input
                type="number"
                min="0"
                step="1"
                className="w-full rounded border px-2 py-1"
                value={stockAmount}
                onChange={e => setStockAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Status</label>
              <select
                className="w-full rounded border px-2 py-1"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="active">active</option>
                <option value="archived">archived</option>
              </select>
            </div>
          </div>

          {/* SKU + Image */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="mb-1 block text-sm">SKU</label>
              <div className="flex gap-2">
                <input
                  className="w-full rounded border px-2 py-1 uppercase tracking-wide"
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  placeholder="Auto or custom"
                />
                <button type="button" className="rounded border px-3 py-1 text-sm hover:bg-gray-50" onClick={regenerateSku}>
                  Regenerate
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm">Image URL</label>
              <input
                className="w-full rounded border px-2 py-1"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="rounded border px-3 py-1 hover:bg-gray-50" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="rounded bg-black px-4 py-1.5 text-white hover:opacity-90">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function patchAttr(list, key, value) {
  const next = Array.isArray(list) ? [...list] : [];
  const i = next.findIndex(x => x.k === key);
  if (i === -1) next.push({ k: key, v: value });
  else next[i] = { k: key, v: value };
  return next;
}

function normalizeAttributes(list) {
  // trim, drop empties, dedupe by key (last write wins)
  const cleaned = (Array.isArray(list) ? list : [])
    .map(x => ({ k: String(x?.k || "").trim(), v: String(x?.v || "").trim() }))
    .filter(x => x.k && x.v);
  const byKey = new Map();
  for (const x of cleaned) byKey.set(x.k, x);
  return Array.from(byKey.values());
}
