import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  gradient?: string;
}

export function MetricCard({ icon, label, value, sub, gradient = "from-blue-500 to-cyan-400" }: Props) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-900 truncate">{value}</p>
          {sub && <p className="mt-1 text-sm text-slate-500 truncate">{sub}</p>}
        </div>
        <div className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-xl text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
