const STEPS = [
  { label: "Upload",    desc: "ZIP / Folder", icon: "☁️" },
  { label: "Cleaning",  desc: "Lọc ảnh lỗi",  icon: "🧹" },
  { label: "Feature",   desc: "Trích đặc trưng", icon: "🧠" },
  { label: "Predict",   desc: "Dự đoán nhãn", icon: "✨" },
  { label: "Report",    desc: "Xuất kết quả", icon: "📊" },
];

interface Props {
  progress: number;
}

export function PipelineSteps({ progress }: Props) {
  const activeStep = Math.min(STEPS.length - 1, Math.floor((progress / 100) * STEPS.length));
  return (
    <div className="grid grid-cols-5 gap-3">
      {STEPS.map((step, index) => {
        const done   = index < activeStep;
        const active = index === activeStep;
        return (
          <div key={step.label} className="relative">
            <div className={`rounded-3xl border p-4 transition ${
              done
                ? "border-emerald-200 bg-emerald-50"
                : active
                ? "border-blue-200 bg-blue-50 shadow-lg shadow-blue-100"
                : "border-slate-200 bg-slate-50"
            }`}>
              <div className={`grid h-11 w-11 place-items-center rounded-2xl text-xl ${
                done   ? "bg-emerald-600 text-white" :
                active ? "bg-blue-600 text-white"    :
                         "bg-white text-slate-400"
              }`}>
                {done ? "✓" : step.icon}
              </div>
              <p className="mt-3 font-black text-slate-950 text-sm">{step.label}</p>
              <p className="text-xs text-slate-500">{step.desc}</p>
              <p className={`mt-2 text-xs font-black uppercase ${
                done ? "text-emerald-700" : active ? "text-blue-700" : "text-slate-400"
              }`}>
                {done ? "Done" : active ? "Running" : "Waiting"}
              </p>
            </div>
            {index < STEPS.length - 1 && (
              <div className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-lg text-slate-300 lg:block">→</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
