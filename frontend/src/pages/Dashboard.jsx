
import { Link, useOutletContext } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import { getNavigationForRole, roleLabels } from "../components/layouts/navigation";

const summaries = {
  normal_user: {
    title: "Your sporting journey starts here",
    description:
      "Discover sports venues, explore events, and keep your activities organised in one place.",
  },
  athlete: {
    title: "Build your performance journey",
    description:
      "Explore training opportunities, find venues, and stay connected with your sporting community.",
  },
  coach: {
    title: "Your coaching workspace",
    description:
      "Access your coaching modules and organise your work as ArenaTech's training features become available.",
  },
  venue_manager: {
    title: "Manage your venue operations",
    description:
      "Access your facilities and booking workflows as venue management features are connected.",
  },
  admin: {
    title: "Platform administration",
    description:
      "Access administration and review workflows for the ArenaTech sports network.",
  },
};

export default function Dashboard() {
  const { user } = useOutletContext();

  const role = summaries[user.role] ? user.role : "normal_user";
  const summary = summaries[role];
  const displayName = user.full_name || "Member";

  const featureItems = getNavigationForRole(role)
    .flatMap((section) => section.items)
    .filter((item) => item.path !== "/dashboard");

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-8 p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="ArenaTech Gujarat / Workspace"
        title={`Welcome back, ${displayName}`}
        description={summary.description}
      />

      <section className="relative overflow-hidden rounded-3xl bg-[#092e27] p-6 text-white sm:p-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-42 border-emerald-300/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-40 h-60 w-60 rounded-full bg-emerald-400/10 blur-3xl"
        />

        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-emerald-200">
            <CheckCircle2 size={14} />
            Authenticated workspace
          </span>

          <h2 className="mt-5 text-2xl font-bold leading-tight sm:text-3xl">
            {summary.title}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-100/80">
            ArenaTech brings sports facilities, activities, and management
            workflows together. Your workspace will expand as each module
            becomes available.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to={role === "venue_manager" ? "/facilities" : "/facilities"}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-bold text-emerald-950 transition hover:bg-emerald-200"
            >
              Explore facilities
              <ArrowRight size={16} />
            </Link>

            <span className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-emerald-100">
              {roleLabels[role] || "Sports Member"}
            </span>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-950">Your modules</h2>
          <p className="mt-1 text-sm text-slate-500">
            Shortcuts available for your current role.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {featureItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={`${item.path}-${item.title}`}
                to={item.path}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-900/4"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                    <Icon size={21} />
                  </span>

                  <ArrowUpRight
                    size={18}
                    className="text-slate-400 transition group-hover:text-emerald-800"
                  />
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Open the {item.title.toLowerCase()} workspace.
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-sky-50 p-3 text-sky-700">
              <Activity size={21} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Your activity</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Booking history, event registrations, and training activity
                will appear here when their backend modules are available.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800">
              <ShieldCheck size={21} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Account and access</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your profile and role are provided by the backend. Sensitive
                actions will also be checked by the backend before they run.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="font-bold text-slate-900">ArenaTech at a glance</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <MapPin className="text-emerald-800" size={20} />
            <p className="mt-3 text-sm font-semibold text-slate-800">
              Facility discovery
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Browse approved facilities.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <CalendarDays className="text-emerald-800" size={20} />
            <p className="mt-3 text-sm font-semibold text-slate-800">
              Sports activities
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Events and bookings are planned modules.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <Users className="text-emerald-800" size={20} />
            <p className="mt-3 text-sm font-semibold text-slate-800">
              Sporting community
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Role-specific tools will grow with the platform.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
