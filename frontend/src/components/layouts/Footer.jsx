
import { Heart, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} ArenaTech Gujarat. Sports, connected.
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-700" />
            Secure workspace
          </span>
          <span className="inline-flex items-center gap-1.5">
            Built for the sporting community
            <Heart size={13} className="text-emerald-700" />
          </span>
        </div>
      </div>
    </footer>
  );
}
