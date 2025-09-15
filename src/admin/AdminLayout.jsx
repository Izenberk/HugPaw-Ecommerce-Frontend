// src/admin/AdminLayout.jsx
import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-dvh grid grid-cols-[220px_1fr]">
      <aside className="border-r p-4">
        <h2 className="mb-3 text-lg font-semibold">Admin</h2>
        <nav className="flex flex-col gap-1 text-sm">
          <NavLink to="/admin/items" className="rounded px-2 py-1 hover:bg-gray-100">
            Items (Variants & Add-ons)
          </NavLink>
        </nav>
      </aside>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
