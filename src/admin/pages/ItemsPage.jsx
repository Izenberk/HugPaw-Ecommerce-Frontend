import { useEffect, useMemo, useState } from "react";
import { listItems, createItem, updateItem, archiveItem } from "../services/itemsApi.js";
import ItemForm from "../components/ItemForm.jsx";
import { getAttr } from "../utils/sku.js";

export default function ItemsPage() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [kindFilter, setKindFilter] = useState("");
  const [status, setStatus] = useState("active");
  const [sort, setSort] = useState("-updatedAt");
  const [loading, setLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (typeFilter) filters["attr[Type]"] = typeFilter;
      if (kindFilter) filters["attr[Kind]"] = kindFilter;
      const { items } = await listItems({ q, status, sort, filters });
      setRows(items || []);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, [q, typeFilter, kindFilter, status, sort]);

  async function handleSave(payload) {
    try {
      if (editing?._id) {
        await updateItem(editing._id, payload);
      } else {
        await createItem(payload);
      }
      setFormOpen(false);
      setEditing(null);
      refresh();
    } catch (e) {
      alert(e.message || String(e));
    }
  }

  async function handleDelete(row) {
    if (!confirm(`Archive ${row.sku}?`)) return;
    try {
      await archiveItem(row._id);
      refresh();
    } catch (e) {
      alert(e.message || String(e));
    }
  }

  const typeOptions = useMemo(() => {
    const s = new Set(rows.map(r => getAttr(r.attributes, "Type")).filter(Boolean));
    return ["Collar","Dispenser","Feeder","Smart Module","Addon", ...Array.from(s)].filter(Boolean);
  }, [rows]);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Items</h1>
        <div className="flex gap-2">
          <button className="rounded border px-3 py-1 hover:bg-gray-50" onClick={() => { setEditing(null); setFormOpen(true); }}>
            + New Item
          </button>
          <button className="rounded border px-3 py-1 hover:bg-gray-50" onClick={refresh} disabled={loading}>
            Refresh
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
        <input className="rounded border px-2 py-1 md:col-span-2" placeholder="Search (SKU or attributes)" value={q} onChange={e => setQ(e.target.value)} />
        <select className="rounded border px-2 py-1" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="rounded border px-2 py-1" value={kindFilter} onChange={e => setKindFilter(e.target.value)}>
          <option value="">All Kinds</option>
          <option value="Variant">Variant</option>
          <option value="Addon">Addon</option>
        </select>
        <select className="rounded border px-2 py-1" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="active">active</option>
          <option value="archived">archived</option>
        </select>
        <select className="rounded border px-2 py-1" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="-updatedAt">Newest</option>
          <option value="sku">SKU A→Z</option>
          <option value="-stockAmount">Stock high→low</option>
          <option value="-unitPrice">Price high→low</option>
        </select>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2 text-left">SKU</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Kind</th>
              <th className="p-2 text-left">Attributes</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Stock</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3 text-center" colSpan={8}>Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="p-3 text-center" colSpan={8}>No items</td></tr>
            ) : (
              rows.map(r => {
                const type = getAttr(r.attributes, "Type");
                const kind = getAttr(r.attributes, "Kind");
                return (
                  <tr key={r._id || r.sku} className="border-b hover:bg-gray-50/50">
                    <td className="p-2 font-mono">{r.sku}</td>
                    <td className="p-2">{type}</td>
                    <td className="p-2">{kind || "Variant"}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {(r.attributes || []).map((a, i) => (
                          <span key={i} className="rounded bg-gray-100 px-2 py-0.5 text-xs">{a.k}: {a.v}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-2 text-right">{Number(r.unitPrice).toLocaleString()}</td>
                    <td className="p-2 text-right">{r.stockAmount}</td>
                    <td className="p-2 text-center">
                      <span className={`rounded px-2 py-0.5 text-xs ${r.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-700"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-2 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                          onClick={() => { setEditing(r); setFormOpen(true); }}>
                          Edit
                        </button>
                        <button className="rounded border px-2 py-1 text-xs hover:bg-red-50"
                          onClick={() => handleDelete(r)}>
                          Archive
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ItemForm
        open={formOpen}
        initial={editing}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleSave}
      />
    </div>
  );
}
