
import { useCallback, useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { apiRequest, setCsrfToken } from "../../services/api";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loadProfile = useCallback(async (signal) => {
    setIsLoading(true);
    setError("");

    try {
      // Restore the CSRF token after a page refresh.
      const csrfResponse = await apiRequest("/api/auth/csrf", {
        signal,
      });

      if (!csrfResponse.ok) {
        throw new Error("Unable to initialize your secure session.");
      }

      const csrfData = await csrfResponse.json();

      if (signal.aborted) return;

      setCsrfToken(csrfData.csrf_token);

      // The browser sends the HttpOnly session cookie automatically.
      const response = await apiRequest("/api/auth/me", {
        signal,
      });

      if (response.status === 401) {
        setUser(null);
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to verify your account. Please try again."
        );
      }

      const profile = await response.json();

      if (!signal.aborted) {
        setUser(profile);
        setError("");
      }
    } catch (err) {
      if (!signal.aborted && err.name !== "AbortError") {
        setError(
          err instanceof TypeError
            ? "Cannot connect to ArenaTech. Check that the backend is running."
            : err.message || "Something went wrong."
        );
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    loadProfile(controller.signal);

    return () => controller.abort();
  }, [location.pathname, loadProfile]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setError("");

    try {
      const response = await apiRequest("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok && response.status !== 401) {
        throw new Error("Sign out failed. Please try again.");
      }

      setUser(null);
      setCsrfToken(null);

      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Cannot reach the server. Please try signing out again."
          : err.message || "Sign out failed."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-800" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Verifying your ArenaTech account...
          </p>
        </div>
      </main>
    );
  }

  if (error && !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Workspace unavailable
          </h1>

          <p
            role="alert"
            className="mt-3 text-sm leading-6 text-red-700"
          >
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-slate-800">
      {error && (
        <div
          role="alert"
          className="fixed right-4 top-4 z-100 max-w-sm rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700 shadow-lg"
        >
          {error}
        </div>
      )}

      <Sidebar
        user={user}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
        collapsed={collapsed}
        onToggleCollapse={() =>
          setCollapsed((value) => !value)
        }
      />

      <div
        className={[
          "flex min-h-screen flex-col transition-[margin] duration-300",
          collapsed ? "lg:ml-21" : "lg:ml-70",
        ].join(" ")}
      >
        <Topbar
          user={user}
          onMenuClick={() => setMobileOpen(true)}
          onLogout={handleLogout}
          sidebarCollapsed={collapsed}
        />

        <main className="flex flex-1 flex-col">
          <Outlet context={{ user }} />
        </main>

        <Footer />
      </div>
    </div>
  );
}
