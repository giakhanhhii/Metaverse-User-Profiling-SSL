"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getDataset, exportUrl } from "@/lib/api";
import type { Dataset } from "@/lib/types";

const FORMATS = [
  { key: "csv",   label: "CSV",   icon: "📄", desc: "Dữ liệu ảnh & dự đoán (Excel-ready)", gradient: "from-emerald-500 to-teal-400" },
  { key: "excel", label: "Excel", icon: "📊", desc: "Báo cáo đa sheet: ảnh, user, metrics",  gradient: "from-blue-500 to-cyan-400" },
  { key: "json",  label: "JSON",  icon: "🔧", desc: "Dữ liệu thô cho developer",             gradient: "from-violet-500 to-purple-400" },
  { key: "pdf",   label: "PDF",   icon: "📋", desc: "Báo cáo in ấn: metrics + user profiles", gradient: "from-rose-500 to-pink-400" },
] as const;

function ExportContent() {
  const params = useSearchParams();
  const datasetId = params.get("id") ?? "";
  const [dataset, setDataset] = useState<Dataset | null>(null);

  useEffect(() => {
    if (datasetId) getDataset(datasetId).then((r) => setDataset(r.data));
  }, [datasetId]);

  function download(format: "csv" | "excel" | "json" | "pdf") {
    window.open(exportUrl(datasetId, format), "_blank");
  }

  if (!datasetId) return <div className="text-center text-slate-400 mt-20">Không có dataset.</div>;

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
          Export Report
        </span>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Xuất báo cáo</h2>
        <p className="mt-2 text-slate-500">
          {dataset?.name ?? datasetId} · {dataset?.valid_images ?? 0} ảnh
        </p>
      </div>

      {dataset?.status !== "done" ? (
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-amber-700 font-semibold">
          ⚠️ Dataset chưa được xử lý xong. Vui lòng chờ pipeline hoàn thành trước khi xuất.
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {FORMATS.map((f) => (
              <div
                key={f.key}
                className="rounded-[2rem] border border-white/70 bg-white/80 backdrop-blur p-6 shadow-xl shadow-slate-200/60 flex flex-col gap-4 transition hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <div className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${f.gradient} text-xl text-white shadow-lg`}>
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-black text-slate-950">{f.label}</p>
                    <p className="text-xs text-slate-500">{f.desc}</p>
                  </div>
                </div>
                <Button onClick={() => download(f.key)} className="w-full" icon="⬇️">
                  Tải {f.label}
                </Button>
              </div>
            ))}
          </div>

          <section className="rounded-[2rem] border border-white/70 bg-white/80 backdrop-blur p-6 shadow-xl shadow-slate-200/60">
            <h3 className="text-xl font-black text-slate-950 mb-4">Nội dung báo cáo bao gồm</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Kết quả dự đoán từng ảnh (5 mô hình)",
                "Hồ sơ sở thích từng người dùng",
                "Phân khúc quảng cáo được gợi ý",
                "Chỉ số đánh giá: Accuracy, F1, Precision, Recall",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="text-sm font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default function ExportPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-400 mt-20">Đang tải…</div>}>
      <ExportContent />
    </Suspense>
  );
}
