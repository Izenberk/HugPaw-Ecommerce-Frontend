import { useEffect, useMemo, useState } from "react";
import { listProducts, createProduct, updateProduct, deleteProduct } from "../services/productsApi.http.js";
import ProductForm from "../components/ProductForm.jsx";
import { getAttr } from "../utils/sku.js";

export default function ProductsPage() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [kindFilter, setKindFilter] = useState("");      // NEW
  const [sort, setSort] = useState("-updatedAt");
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState("");

  const HEADERS = ["SKU", "Type", "Kind", "Attributes", "Price", "Stock", "Actions"];

  const DEFAULT_TYPES = ["Collar", "Dispenser", "Feeder", "Smart Module"]; // include Smart Module
  const KIND_OPTIONS = ["Variant", "Addon"]; // NEW

  async function refresh() {
    setLoading(true); setErr("");
    try {
      const filters = {};
      if (typeFilter) filters["attr[Type]"] = typeFilter;
      if (kindFilter) filters["attr[Kind]"] = kindFilter; // NEW
      const { items } = await listProducts({ q, sort, filters });
      setRows(items || []);
    } catch (e) { setErr(e.message || String(e)); }
    finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, [q, typeFilter, kindFilter, sort]); // include kindFilter

  async function handleSave(payload) {
    if (editing?._id) {
      await updateProduct(editing._id, payload);
    } else {
      await createProduct(payload);
    }
    await refresh();
  }

  async function handleDelete(row) {
    if (!confirm(`Delete ${row.sku}?`)) return;
    await deleteProduct(row._id);
    await refresh();
  }

  const typeOptions = useMemo(() => {
    const set = new Set(DEFAULT_TYPES);
    rows.forEach((r) => {
      const t = getAttr(r.attributes, "Type");
      if (t) set.add(t);
    });
    return Array.from(set);
  }, [rows]);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <div className="flex gap-2">
          <button className="rounded border px-3 py-1 hover:bg-gray-50" onClick={()=>{ setEditing(null); setFormOpen(true); }}>+ New</button>
          <button className="rounded border px-3 py-1 hover:bg-gray-50" onClick={refresh} disabled={loading}>Refresh</button>
        </div>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
        <input
          className="rounded border px-2 py-1 md:col-span-3"
          placeholder="Search (SKU or attributes)"
          value={q}
          onChange={e=>setQ(e.target.value)}
        />
        <select className="rounded border px-2 py-1" value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          {typeOptions.map((t) => (
            <option key={`type-${t}`} value={t}>{t}</option>
          ))}
        </select>
        <select className="rounded border px-2 py-1" value={kindFilter} onChange={e=>setKindFilter(e.target.value)}>
          <option value="">All Kinds</option>
          {KIND_OPTIONS.map(k => (
            <option key={`kind-${k}`} value={k}>{k}</option>
          ))}
        </select>
        <select className="rounded border px-2 py-1" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="-updatedAt">Newest</option>
          <option value="sku">SKU A→Z</option>
          <option value="-stockAmount">Stock high→low</option>
          <option value="-unitPrice">Price high→low</option>
        </select>
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-[820px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {HEADERS.map((h) => (
                  <th
                    key={`head-${h}`}
                    className={h === "Actions" ? "p-2 text-right" : h === "Price" || h === "Stock" ? "p-2 text-right" : "p-2 text-left"}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3 text-center" colSpan={7}>Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="p-3 text-center" colSpan={7}>No products</td></tr>
            ) : rows.map(r => {
              const kind = getAttr(r.attributes, "Kind") || "Variant"; // default display
              return (
                <tr key={r._id ?? r.sku} className="border-b hover:bg-gray-50/50">
                  <td className="p-2 font-mono">{r.sku}</td>
                  <td className="p-2">{getAttr(r.attributes,"Type")}</td>
                  <td className="p-2">
                    <span
                      className={
                        "inline-flex items-center rounded px-2 py-0.5 text-xs " +
                        (kind.toLowerCase() === "addon"
                          ? "bg-violet-100 text-violet-700"
                          : "bg-gray-100 text-gray-700")
                      }
                    >
                      {kind}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-1">
                      {(r.attributes||[]).map((a,i)=>(
                        <span
                          key={`${r._id ?? r.sku}:${a.k}:${a.v}:${i}`} // composite key to avoid collisions
                          className="rounded bg-gray-100 px-2 py-0.5 text-xs"
                        >
                          {a.k}: {a.v}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-2 text-right">{Number(r.unitPrice).toLocaleString()}</td>
                  <td className="p-2 text-right">{r.stockAmount}</td>
                  <td className="p-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                        onClick={()=>{ setEditing(r); setFormOpen(true); }}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded border px-2 py-1 text-xs hover:bg-red-50"
                        onClick={()=>handleDelete(r)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ProductForm
        open={formOpen}
        initial={editing}
        onClose={()=>{ setFormOpen(false); setEditing(null); }}
        onSubmit={handleSave}
      />
    </div>
  );
}
