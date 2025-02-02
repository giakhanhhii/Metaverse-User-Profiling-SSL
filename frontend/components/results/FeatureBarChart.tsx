"use client";

interface Props {
  distribution: Record<string, number>;
}

export function FeatureBarChart({ distribution }: Props) {
  const entries = Object.entries(distribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);
  const max = entries[0]?.[1] ?? 1;

  return (
    <div className="space-y-3">
      {entries.map(([label, value]) => (
        <div key={label}>
          <div className="mb-1.5 flex items-center justify-between text-sm font-bold">
            <span className="text-slate-700 capitalize">{label}</span>
            <span className="text-blue-700">{Math.round(value * 100)}%</span>
          </div>
          <div className="h-5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-all duration-700"
              style={{ width: `${(value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
