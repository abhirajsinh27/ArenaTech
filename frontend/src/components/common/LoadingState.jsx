
export default function LoadingState({
  message = "Loading...",
}) {
  return (
    <div
      role="status"
      className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8"
    >
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-800" />
      <p className="mt-4 text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}
