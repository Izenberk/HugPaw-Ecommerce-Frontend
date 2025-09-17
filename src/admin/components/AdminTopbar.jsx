import { useNavigate } from "react-router-dom";
import HugPawLogo from "@/assets/HugPaw-logo.svg";

export default function AdminTopbar({
  collapsed,
  onToggleCollapsed,
  onOpenMobile,
  onSignOut,
}) {
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await onSignOut?.();
    } catch {
      /* ignore */
    }
    navigate("/"); // back to homepage
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 border-b bg-white/90 px-3 py-2 backdrop-blur">
      {/* Mobile menu button */}
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded md:hidden hover:bg-gray-100"
        aria-label="Open menu"
        onClick={onOpenMobile}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Brand */}
      <div className="flex items-center gap-2">
        <img
          src={HugPawLogo}
          alt="HugPaw logo"
          className="h-6 w-6"
        />
        <span className="font-medium">Admin</span>
      </div>

      <div className="ml-auto" />

      {/* Desktop collapse toggle */}
      <button
        type="button"
        className="hidden md:inline-flex items-center gap-2 rounded border px-2 py-1 text-sm hover:bg-gray-50"
        aria-pressed={collapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={onToggleCollapsed}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          aria-hidden="true"
        >
          {collapsed ? (
            <path
              d="M14 7l-5 5 5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M10 7l5 5-5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
        <span className="hidden lg:inline">
          {collapsed ? "Expand" : "Collapse"}
        </span>
      </button>

      {/* Sign out */}
      <button
        type="button"
        className="ml-2 inline-flex items-center gap-2 rounded border px-2 py-1 text-sm hover:bg-gray-50"
        onClick={handleSignOut}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M10 17l5-5-5-5M15 12H4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M20 19V5a2 2 0 0 0-2-2h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>Sign out</span>
      </button>
    </header>
  );
}
