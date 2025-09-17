import { NavLink } from "react-router-dom";

function cx(...a) { return a.filter(Boolean).join(" "); }

function BoxIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M3 7.5 12 3l9 4.5-9 4.5L3 7.5Z" fill="currentColor" opacity=".2" />
      <path d="M3 7.5v9l9 4.5v-9l-9-4.5Z" fill="currentColor" opacity=".35" />
      <path d="M21 7.5v9l-9 4.5v-9l9-4.5Z" fill="currentColor" />
    </svg>
  );
}

const linkClass = ({ isActive }) =>
  cx(
    "flex items-center gap-2 rounded px-2 py-1 text-sm",
    isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-800"
  );

export default function AdminSidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
}) {
  // Desktop rail
  return (
    <>
      <aside
        className={cx(
          "sticky top-[48px] hidden h-[calc(100dvh-48px)] border-r bg-white transition-all md:block",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className="flex h-full flex-col p-3">
          <nav className="flex flex-col gap-1">
            <NavLink to="/admin/products" className={linkClass}>
              <BoxIcon />
              {!collapsed && 
              <span>Variants & Add-ons </span>}
            </NavLink>
            {/* Add more links here */}
          </nav>
          <div className="mt-auto pt-3 text-[11px] text-gray-400">
            {!collapsed && <span>v1 • responsive</span>}
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/35"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <div className="font-medium">Admin Menu</div>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded hover:bg-gray-100"
                onClick={onCloseMobile}
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-3">
              <NavLink to="/admin/products" className={linkClass} onClick={onCloseMobile}>
                <BoxIcon />
                <span>Products <span className="text-gray-500">(Variants & Add-ons)</span></span>
              </NavLink>
              {/* More links... */}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
