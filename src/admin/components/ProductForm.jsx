import { useEffect, useState } from "react";
import AttributeEditor from "./AttributeEditor.jsx";
import { buildSku, getAttr } from "../utils/sku.js";
import NumberField from "./NumberField.jsx";

export default function ProductForm({ open, onClose, onSubmit, initial }) {
  const [sku, setSku] = useState("");
  const [attributes, setAttributes] = useState([]);

  const kindValue = getAttr(attributes, "Kind") || "Variant";
  const forTypeValue = getAttr(attributes, "For Type") || "";

  // text-state to avoid 0100 issue
  const [unitPriceText, setUnitPriceText] = useState("");
  const [stockText, setStockText] = useState("");

  // NEW: submit UX
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!open) return;
    setSku(String(initial?.sku || ""));
    setAttributes(Array.isArray(initial?.attributes) ? initial.attributes : []);
    const up = initial?.unitPrice ?? initial?.basePrice ?? "";
    setUnitPriceText(up === "" || up == null ? "" : String(up));
    const st = initial?.stockAmount ?? "";
    setStockText(st === "" || st == null ? "" : String(st));
    setSubmitting(false);
    setErrorMsg("");
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    setAttributes(prev => {
      const hasKind = (Array.isArray(prev) ? prev : []).some(a => a?.k === "Kind");
      return hasKind ? prev : patchAttr(prev, "Kind", "Variant");
    });
  }, [open]);

  const typeValue = getAttr(attributes, "Type");

  function regenerateSku() {
    const s = buildSku(attributes);
    if (s) setSku(s);
  }

  async function submit(e) {
    e.preventDefault();
    if (submitting) return; // guard: block re-entry
    setErrorMsg("");

    if ((kindValue || "").toLowerCase().startsWith("addon") && !forTypeValue) {
      setErrorMsg("For Type is required for add-ons");
      return;
    }

    // simple front-end validation
    const trimmedSku = String(sku).trim().toUpperCase();
    if (!trimmedSku) {
      setErrorMsg("SKU is required");
      return;
    }

    const payload = {
      sku: trimmedSku,
      attributes: ensureKindAndCompat(
        normalizeAttributes(attributes),
        kindValue,
        typeValue
      ),
      unitPrice: parsePrice(unitPriceText),
      stockAmount: parseStock(stockText),
    };

    try {
      setSubmitting(true);
      await onSubmit?.(payload);           // IMPORTANT: Items/ProductsPage handleSave must return a Promise
      onClose();                           // close on success
    } catch (err) {
      setErrorMsg(err?.message || "Save failed");
      setSubmitting(false);                // re-enable controls on error
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{initial ? "Edit Product" : "New Product"}</h3>
          <button className="rounded px-2 py-1 text-sm hover:bg-gray-100" onClick={onClose} disabled={submitting}>✕</button>
        </div>

        {/* aria-busy communicates loading to assistive tech */}
        <form onSubmit={submit} className="space-y-4" aria-busy={submitting}>
          {/* Disable everything while saving to prevent changes and double submits */}
          <fieldset disabled={submitting} className={submitting ? "opacity-75 pointer-events-none transition-opacity" : ""}>
            {/* Quick: Type + Kind */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm">Type</label>
                <input
                  className="w-full rounded border px-2 py-1"
                  list="product-type"
                  value={getAttr(attributes, "Type")}
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

              <div>
                <label className="mb-1 block text-sm">Kind</label>
                <select
                  className="w-full rounded border px-2 py-1"
                  value={kindValue}
                  onChange={e => {
                    const nextKind = e.target.value;
                    let next = patchAttr(attributes, "Kind", nextKind);
                    if (nextKind !== "Addon") {
                      // if switching away from Addon, drop For Type to avoid stale compat
                      next = patchAttr(next, "For Type", "");
                    }
                    setAttributes(next);
                  }}
                >
                  <option>Variant</option>
                  <option>Addon</option>
                </select>
              </div>
            </div>

            {kindValue === "Addon" && (
              <div>
                <label className="mb-1 block text-sm">For Type (compatibility)</label>
                <select
                  className="w-full rounded border px-2 py-1"
                  value={forTypeValue}
                  onChange={e => setAttributes(patchAttr(attributes, "For Type", e.target.value))}
                >
                  <option value="">— Select base product type —</option>
                  <option>Collar</option>
                  <option>Dispenser</option>
                  <option>Feeder</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Example: GPS is only compatible with <b>Collar</b>.
                </p>
              </div>
            )}

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
          </fieldset>

          {/* Error + Actions */}
          {errorMsg && (
            <p className="text-sm text-red-600" role="alert">{errorMsg}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="rounded border px-3 py-1 hover:bg-gray-50" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded bg-black px-4 py-1.5 text-white hover:opacity-90 disabled:opacity-60"
            >
              {submitting && <Spinner />}
              {submitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Tiny inline spinner */
function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
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

function ensureKindAndCompat(list, kind, typeVal) {
  const map = new Map((Array.isArray(list) ? list : []).map(x => [x.k, x.v]));

  // Always set Kind (default Variant)
  map.set("Kind", kind || "Variant");

  // If a Type was chosen via the quick field, keep it
  if (typeVal && !map.get("Type")) map.set("Type", typeVal);

  // If not Addon, remove any lingering For Type
  const isAddon = String(kind || "").toLowerCase() === "addon";
  if (!isAddon) map.delete("For Type");

  // Emit array, drop empties
  return Array.from(map.entries())
    .map(([k, v]) => ({ k, v }))
    .filter(x => x.k && x.v);
}