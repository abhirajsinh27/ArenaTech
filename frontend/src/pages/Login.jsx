
import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { apiRequest, setCsrfToken } from "../services/api";
import { Link, useLocation, useNavigate } from "react-router-dom";



export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isLoading) return;

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
  const response = await apiRequest("/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
  }),
});

const data = await response.json().catch(() => null);

if (!response.ok) {
  const detail = data?.detail;

  const message = Array.isArray(detail)
    ? detail.map((item) => item.msg).join(", ")
    : detail;

  throw new Error(
    typeof message === "string"
      ? message
      : "Login failed. Please try again."
  );
}

if (!data?.user || !data?.csrf_token) {
  throw new Error("The server returned an invalid login response.");
}

setCsrfToken(data.csrf_token);

const destination = location.state?.from?.pathname || "/dashboard";
navigate(destination, { replace: true });} catch (err) {
      if (err instanceof TypeError) {
        setError(
          "Cannot connect to the server. Please check that the backend is running."
        );
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  const inputClass =
    "w-full min-w-0 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400";

  const fieldClass =
    "flex items-center gap-3 rounded-xl border border-slate-200 px-3 transition focus-within:border-emerald-700 focus-within:ring-4 focus-within:ring-emerald-700/10";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9">
        <header className="mb-9 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-900 text-white">
            <ShieldCheck size={27} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            ArenaTech Gujarat
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Your connected sports platform
          </p>
        </header>

        <div className="mb-7">
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome back
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email address
            </label>

            <div className={fieldClass}>
              <Mail size={18} className="shrink-0 text-slate-400" />

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>

            <div className={fieldClass}>
              <Lock size={18} className="shrink-0 text-slate-400" />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={inputClass}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="shrink-0 rounded-md p-1 text-slate-400 hover:text-slate-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-900/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign in"}
            {!isLoading && <ArrowRight size={17} />}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-emerald-800 hover:text-emerald-950 hover:underline"
          >
            Create account
          </Link>
        </p>
      </section>
    </main>
  );
}
