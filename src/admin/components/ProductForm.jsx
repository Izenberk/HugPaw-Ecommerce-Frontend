import { useEffect, useState } from "react";
import AttributeEditor from "./AttributeEditor.jsx";
import { buildSku, getAttr } from "../utils/sku.js";

export default function ProductForm({ open, onClose, onSubmit, initial }) {
  const [sku, setSku] = useState("");
  const [attributes, setAttributes] = useState([]);

  // text-state to avoid 0100 issue
  const [unitPriceText, setUnitPriceText] = useState("");
  const [stockText, setStockText] = useState("");

  useEffect(() => {
    if (!open) return;
    setSku(String(initial?.sku || ""));
    setAttributes(Array.isArray(initial?.attributes) ? initial.attributes : []);
    const up = initial?.unitPrice ?? initial?.basePrice ?? "";
    setUnitPriceText(up === "" || up == null ? "" : String(up));
    const st = initial?.stockAmount ?? "";
    setStockText(st === "" || st == null ? "" : String(st));
  }, [open, initial]);

  const typeValue = getAttr(attributes, "Type");

  function regenerateSku() {
    const s = buildSku(attributes);
    if (s) setSku(s);
  }

  async function submit(e) {
    e.preventDefault();
    const payload = {
      sku: String(sku).trim().toUpperCase(),
      attributes: normalizeAttributes(attributes),
      unitPrice: parsePrice(unitPriceText),
      stockAmount: parseStock(stockText),
    };
    await onSubmit?.(payload);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{initial ? "Edit Product" : "New Product"}</h3>
          <button className="rounded px-2 py-1 text-sm hover:bg-gray-100" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Quick: Type */}
          <div>
            <label className="mb-1 block text-sm">Type</label>
            <input
              className="w-full rounded border px-2 py-1"
              list="product-type"
              value={typeValue}
              onChange={e => setAttributes(patchAttr(attributes, "Type", e.target.value))}
              placeholder="Collar / Dispenser / Feeder / Smart Module"
            />
            <datalist id="product-type">
              <option value="Collar" />
              <option value="Dispenser" />
              <option value="Feeder" />
              <option value="Smart Module" />
            </datalist>
          </div>

          {/* Attributes */}
          <div>
            <label className="mb-1 block text-sm">Attributes</label>
            <AttributeEditor value={attributes} onChange={setAttributes} typeValue={typeValue} />
          </div>

          {/* Price / Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm">Unit Price (THB)</label>
              <NumberField
                value={unitPriceText}
                onChange={setUnitPriceText}
                allowFloat
                placeholder="e.g. 330"
                className="w-full rounded border px-2 py-1"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Stock</label>
              <NumberField
                value={stockText}
                onChange={setStockText}
                placeholder="e.g. 150"
                className="w-full rounded border px-2 py-1"
              />
            </div>
          </div>

          {/* SKU */}
          <div>
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

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="rounded border px-3 py-1 hover:bg-gray-50" onClick={onClose}>Cancel</button>
            <button type="submit" className="rounded bg-black px-4 py-1.5 text-white hover:opacity-90">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* helpers */
function patchAttr(list, key, value) {
  const next = Array.isArray(list) ? [...list] : [];
  const i = next.findIndex(x => x.k === key);
  if (i === -1) next.push({ k: key, v: value });
  else next[i] = { k: key, v: value };
  return next;
}
function normalizeAttributes(list) {
  const cleaned = (Array.isArray(list)?list:[])
    .map(x => ({ k: String(x?.k||"").trim(), v: String(x?.v||"").trim() }))
    .filter(x => x.k && x.v);
  const byKey = new Map();
  for (const x of cleaned) byKey.set(x.k, x);
  return Array.from(byKey.values());
}
function parsePrice(s){ if(s==null||s==="")return 0; let t=String(s).replace(/[^0-9.]/g,""); const p=t.split("."); if(p.length>2)t=`${p[0]}.${p.slice(1).join("")}`; const n=parseFloat(t); return Number.isFinite(n)?n:0; }
function parseStock(s){ if(s==null||s==="")return 0; let t=String(s).replace(/\D/g,""); t=t.replace(/^0+(?=\d)/,""); const n=parseInt(t||"0",10); return Number.isFinite(n)?n:0; }
