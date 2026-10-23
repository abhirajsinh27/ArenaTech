
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this information. Please try again.",
  onRetry,
}) {
  return (
    <section
      role="alert"
      className="rounded-2xl border border-red-200 bg-white p-6"
    >
      <div className="flex items-start gap-3">
        <AlertCircle size={21} className="mt-0.5 shrink-0 text-red-700" />

        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
