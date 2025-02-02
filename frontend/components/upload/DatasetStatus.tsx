import type { Dataset } from "@/lib/types";

const statusStyles: Record<string, string> = {
  pending:    "bg-slate-50 text-slate-600 ring-slate-200",
  processing: "bg-blue-50 text-blue-700 ring-blue-200",
  done:       "bg-emerald-50 text-emerald-700 ring-emerald-200",
  error:      "bg-red-50 text-red-700 ring-red-200",
};

const statusLabels: Record<string, string> = {
  pending: "Pending", processing: "Processing", done: "Done", error: "Error",
};

export function DatasetStatus({ dataset }: { dataset: Dataset }) {
  const pillStyle = statusStyles[dataset.status] ?? statusStyles.pending;
  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-black text-slate-950 truncate max-w-[200px]">{dataset.name}</h3>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${pillStyle}`}>
          {statusLabels[dataset.status] ?? dataset.status}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Detected" value={dataset.total_images} />
        <Stat label="Valid" value={dataset.valid_images} color="text-emerald-700" bg="bg-emerald-50" />
        <Stat label="Invalid" value={dataset.invalid_images} color="text-amber-700" bg="bg-amber-50" />
      </div>
      {dataset.error_message && (
        <p className="text-xs text-red-600 bg-red-50 rounded-2xl p-3">{dataset.error_message}</p>
      )}
    </div>
  );
}

function Stat({ label, value, color = "text-slate-950", bg = "bg-slate-50" }: { label: string; value: number; color?: string; bg?: string }) {
  return (
    <div className={`rounded-2xl ${bg} p-4 text-center`}>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-xs font-bold text-slate-500">{label}</p>
    </div>
  );
}
