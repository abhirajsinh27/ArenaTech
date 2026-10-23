
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  LogOut,
  X,
  Zap,
} from "lucide-react";

import { getNavigationForRole, roleLabels } from "./navigation";

export default function Sidebar({
  user,
  mobileOpen,
  onClose,
  onLogout,
  collapsed,
  onToggleCollapse,
}) {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    Overview: true,
    Discover: true,
    "My Activity": true,
    Performance: true,
    Coaching: true,
    "Venue Operations": true,
    "Platform Management": true,
  });

  const role = user?.role ?? "normal_user";
  const sections = getNavigationForRole(role);
  const displayName = user?.full_name || "ArenaTech Member";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  function toggleSection(label) {
    setExpandedSections((previous) => ({
      ...previous,
      [label]: !previous[label],
    }));
  }

  function isSectionActive(items) {
    return items.some(
      (item) =>
        location.pathname === item.path ||
        (item.path !== "/dashboard" &&
          item.path !== "/" &&
          location.pathname.startsWith(`${item.path}/`))
    );
  }

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col",
          "border-r border-white/10 bg-[#071f1b] text-slate-200",
          "transition-[width,transform] duration-300 ease-in-out",
          collapsed ? "w-21" : "w-70",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex h-21 shrink-0 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-950/30">
            <Zap size={22} fill="currentColor" />
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-bold tracking-tight text-white">
                ArenaTech
              </h1>
              <p className="mt-0.5 truncate text-xs text-emerald-300">
                Gujarat Sports Network
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Workspace label */}
        {!collapsed && (
          <div className="px-5 pb-2 pt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Workspace
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-5 overflow-y-auto px-3 py-3"
        >
          {sections.map((section) => {
            const sectionActive = isSectionActive(section.items);
            const isExpanded =
              expandedSections[section.label] ?? true;

            return (
              <div key={section.label}>
                {!collapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.label)}
                    aria-expanded={isExpanded}
                    className={[
                      "mb-1 flex w-full items-center justify-between",
                      "rounded-lg px-3 py-2 text-left",
                      "text-[10px] font-bold uppercase tracking-[0.16em]",
                      sectionActive
                        ? "text-emerald-300"
                        : "text-slate-500 hover:text-slate-300",
                    ].join(" ")}
                  >
                    <span>{section.label}</span>
                    <ChevronDown
                      size={14}
                      className={[
                        "transition-transform",
                        isExpanded ? "" : "-rotate-90",
                      ].join(" ")}
                    />
                  </button>
                ) : (
                  <div
                    className="mx-auto mb-2 h-px w-9 bg-white/10"
                    aria-hidden="true"
                  />
                )}

                {(collapsed || isExpanded) && (
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;

                      return (
                        <NavLink
                          key={item.path + item.title}
                          to={item.path}
                          end={item.path === "/dashboard"}
                          onClick={onClose}
                          title={collapsed ? item.title : undefined}
                          className={({ isActive }) =>
                            [
                              "group relative flex items-center gap-3 rounded-xl",
                              "px-3 py-3 text-sm transition-all duration-200",
                              collapsed ? "justify-center" : "",
                              isActive
                                ? "bg-emerald-400/15 font-semibold text-emerald-300"
                                : "text-slate-400 hover:bg-white/6 hover:text-white",
                            ].join(" ")
                          }
                        >
                          {({ isActive }) => (
                            <>
                              {isActive && (
                                <span className="absolute bottom-2 left-0 top-2 w-0.75 rounded-r-full bg-emerald-400" />
                              )}

                              <Icon
                                size={19}
                                strokeWidth={isActive ? 2.2 : 1.8}
                                className="shrink-0"
                              />

                              {!collapsed && (
                                <span className="min-w-0 flex-1 truncate">
                                  {item.title}
                                </span>
                              )}

                              {!collapsed && isActive && (
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                              )}
                            </>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Help link */}
        <div className="shrink-0 px-3 pb-3">
          <button
            type="button"
            disabled
            title="Help centre will be available in a future release."
            className={[
              "flex w-full cursor-not-allowed items-center gap-3",
              "rounded-xl px-3 py-3 text-sm text-slate-500 opacity-80",
              collapsed ? "justify-center" : "",
            ].join(" ")}
          >
            <CircleHelp size={19} className="shrink-0" />
            {!collapsed && <span>Help centre</span>}
          </button>
        </div>

        {/* Account area */}
        <div className="shrink-0 border-t border-white/10 p-3">
          <div
            className={[
              "mb-2 flex items-center gap-3 rounded-xl",
              "border border-white/6 bg-white/4 p-3",
              collapsed ? "justify-center" : "",
            ].join(" ")}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-sm font-bold text-emerald-300 ring-1 ring-emerald-400/20">
              {initials || "A"}
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {displayName}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-emerald-300">
                  {roleLabels[role] || "Sports Member"}
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onLogout}
            title={collapsed ? "Sign out" : undefined}
            className={[
              "flex w-full items-center gap-3 rounded-xl px-3 py-3",
              "text-sm text-slate-400 transition hover:bg-red-400/10",
              "hover:text-red-300",
              collapsed ? "justify-center" : "",
            ].join(" ")}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>

          {/* Desktop collapse control */}
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="mt-2 hidden w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs text-slate-500 transition hover:bg-white/5 hover:text-white lg:flex"
          >
            {collapsed ? (
              <ChevronRight size={17} />
            ) : (
              <>
                <ChevronLeft size={17} />
                Collapse sidebar
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
