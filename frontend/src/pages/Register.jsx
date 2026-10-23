
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Lock,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { apiRequest } from "../services/api";

const API_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.fullName.trim().length < 2) {
      setError("Full name must contain at least 2 characters.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest("/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    full_name: formData.fullName.trim(),
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
  }),
});

const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("This email is already registered. Please sign in.");
        }

        if (response.status === 422) {
          const detail = data.detail;

          if (Array.isArray(detail)) {
            throw new Error(
              detail.map((item) => item.msg).join(". ")
            );
          }

          throw new Error(
            typeof detail === "string"
              ? detail
              : "Please check your registration details."
          );
        }

        throw new Error(
          data.detail || "Registration failed. Please try again."
        );
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          "Cannot connect to the server. Please ensure the backend is running."
        );
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass =
    "w-full min-w-0 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400";

  const fieldClass =
    "flex items-center gap-3 rounded-xl border border-slate-200 px-3 transition focus-within:border-emerald-700 focus-within:ring-4 focus-within:ring-emerald-700/10";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-10">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-900 text-white">
            <UserPlus size={26} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            ArenaTech Gujarat
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Join the connected sports community
          </p>
        </header>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Create your account
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            New accounts start as Normal User. An administrator can assign
            another role later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullName" className={labelClass}>
              Full name
            </label>

            <div className={fieldClass}>
              <UserRound size={18} className="shrink-0 text-slate-400" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

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
                autoComplete="email"
                placeholder="you@example.com"
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
                type="password"
                autoComplete="new-password"
                minLength={8}
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClass}>
              Confirm password
            </label>

            <div className={fieldClass}>
              <Lock size={18} className="shrink-0 text-slate-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClass}
                required
              />
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

          {success && (
            <p
              role="status"
              className="rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-800"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-900/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Create account"}
            {!isLoading && <ArrowRight size={17} />}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-emerald-800 hover:text-emerald-950 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
