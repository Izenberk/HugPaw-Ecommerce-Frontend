import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminTopbar from "./components/AdminTopbar.jsx";
import AdminSidebar from "./components/AdminSidebar.jsx";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("admin.sidebarCollapsed") === "1"; } catch { return false; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  // persist collapse preference
  useEffect(() => {
    try { localStorage.setItem("admin.sidebarCollapsed", collapsed ? "1" : "0"); } catch {/**/}
  }, [collapsed]);

  // lock scroll when mobile drawer open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  return (
    <div className="min-h-dvh bg-gray-50">
      <AdminTopbar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed(v => !v)}
        onOpenMobile={() => setMobileOpen(true)}
        // onSignOut={async () => await auth.logout()} // <- plug in your auth if available
      />

      <div className="relative mx-auto flex min-h-[calc(100dvh-48px)] max-w-screen-2xl">
        <AdminSidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <main className="min-w-0 flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
