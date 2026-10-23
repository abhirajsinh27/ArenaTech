
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
  X,
} from "lucide-react";

const routeTitles = [
  ["/dashboard", "Dashboard"],
  ["/facilities", "Sports Facilities"],
  ["/events", "Sports Events"],
  ["/bookings", "My Bookings"],
  ["/training", "Training"],
  ["/athletes", "Athletes"],
  ["/maintenance", "Maintenance"],
  ["/admin/users", "User Management"],
  ["/admin/facilities", "Facility Approvals"],
  ["/admin", "Administration"],
];

export default function Topbar({
  user,
  onMenuClick,
  onLogout,
  sidebarCollapsed,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const profileRef = useRef(null);

  const pageTitle =
    routeTitles.find(([path]) =>
      path === "/admin"
        ? location.pathname === path
        : location.pathname === path ||
          location.pathname.startsWith(`${path}/`)
    )?.[1] ?? "Workspace";

  const initials = (user?.full_name || "ArenaTech Member")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  function handleSearch(event) {
    event.preventDefault();

    const query = searchTerm.trim();
    if (!query) return;

    navigate(`/facilities?search=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  }

  return (
    <header
      className={[
        "sticky top-0 z-30 flex h-19 items-center justify-between",
        "gap-3 border-b border-slate-200/80 bg-white/90 px-4",
        "backdrop-blur-xl sm:px-6 lg:px-8",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <span>ArenaTech</span>
            <span>/</span>
            <span className="text-slate-600">Workspace</span>
          </div>
          <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:mt-1 sm:text-xl">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <form
          onSubmit={handleSearch}
          className={[
            "items-center gap-2 rounded-xl border border-slate-200",
            "bg-slate-50 px-3 py-2 transition-all",
            searchOpen ? "flex w-44 sm:w-64" : "hidden md:flex md:w-60",
          ].join(" ")}
        >
          <Search size={17} className="shrink-0 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onFocus={() => setSearchOpen(true)}
            placeholder="Find a facility..."
            aria-label="Search sports facilities"
            className="min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          {searchOpen && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSearchOpen(false);
              }}
              aria-label="Close search"
              className="text-slate-400 hover:text-slate-700"
            >
              <X size={16} />
            </button>
          )}
        </form>

        <button
          type="button"
          onClick={() => setSearchOpen((open) => !open)}
          aria-label="Open search"
          className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 md:hidden"
        >
          <Search size={19} />
        </button>

        <button
          type="button"
          disabled
          title="Notifications will be enabled with the notification module."
          aria-label="Notifications (coming soon)"
          className="relative rounded-xl border border-slate-200 p-2.5 text-slate-400 opacity-70"
        >
          <Bell size={19} />
        </button>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            aria-expanded={profileOpen}
            aria-label="Open account menu"
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-900 text-xs font-bold text-white">
              {initials || "A"}
            </span>
            <span className="hidden max-w-32 text-left sm:block">
              <span className="block truncate text-sm font-semibold text-slate-800">
                {user?.full_name || "Member"}
              </span>
              <span className="block text-[11px] text-slate-500">
                Account
              </span>
            </span>
            <ChevronDown
              size={15}
              className="hidden text-slate-400 sm:block"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
              <div className="border-b border-slate-100 px-3 py-3">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {user?.full_name || "ArenaTech Member"}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {user?.email || ""}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/profile");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <UserRound size={17} />
                My profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Settings size={17} />
                Settings
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-700 hover:bg-red-50"
              >
                <LogOut size={17} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
