"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PipelineSteps } from "@/components/processing/PipelineSteps";
import { Button } from "@/components/ui/Button";
import { getStatus } from "@/lib/api";
import type { Dataset } from "@/lib/types";

function ProcessingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const datasetId = params.get("id") ?? "";

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const prevStep = useRef("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!datasetId) return;
    const poll = async () => {
      try {
        const res = await getStatus(datasetId);
        const d = res.data;
        setDataset(d);
        if (d.current_step && d.current_step !== prevStep.current) {
          prevStep.current = d.current_step;
          setLogs((prev) => [...prev, d.current_step]);
        }
        if (d.status === "done") {
          clearInterval(intervalRef.current!);
          setLogs((prev) => [...prev, "✅ Pipeline hoàn thành!"]);
          setTimeout(() => router.push(`/results?id=${datasetId}`), 1500);
        }
        if (d.status === "error") {
          clearInterval(intervalRef.current!);
          setLogs((prev) => [...prev, `❌ Lỗi: ${d.error_message ?? "Unknown error"}`]);
        }
      } catch { /* ignore transient */ }
    };
    poll();
    intervalRef.current = setInterval(poll, 2000);
    return () => clearInterval(intervalRef.current!);
  }, [datasetId, router]);

  if (!datasetId) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center text-slate-400">
        Không tìm thấy dataset.{" "}
        <a href="/upload" className="text-blue-600 underline font-bold">Tải lên</a>
      </main>
    );
  }

  const progress = dataset?.progress ?? 0;
  const processed = Math.round((progress / 100) * (dataset?.valid_images ?? 0));

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
            Analysis Pipeline
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Đang phân tích dataset ảnh</h2>
          <p className="mt-2 text-slate-500">
            {dataset?.name ?? "Dataset"} · {dataset?.valid_images ?? 0} ảnh hợp lệ
          </p>
        </div>
        {dataset?.status === "done" && (
          <Button onClick={() => router.push(`/results?id=${datasetId}`)} icon="📊">
            Xem kết quả
          </Button>
        )}
      </div>

      {/* Pipeline step cards */}
      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur">
        <PipelineSteps progress={progress} />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Status card */}
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-950">Processing Status</h3>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
              progress >= 100 ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-blue-50 text-blue-700 ring-blue-200"
            }`}>
              {progress >= 100 ? "Completed" : "Running"}
            </span>
          </div>
          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm font-bold text-slate-600">
                <span>Images processed</span>
                <span>{processed} / {dataset?.valid_images ?? 0}</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-400">Progress</p>
                <p className="mt-1 text-2xl font-black text-slate-950">{progress}%</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-400">Status</p>
                <p className="mt-1 text-lg font-black text-slate-950 capitalize">{dataset?.status ?? "—"}</p>
              </div>
            </div>
            {dataset?.status === "done" && (
              <Button onClick={() => router.push(`/results?id=${datasetId}`)} className="w-full" icon="📊">
                Open Result Dashboard
              </Button>
            )}
            {dataset?.status === "error" && (
              <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-semibold">
                ❌ {dataset.error_message}
              </div>
            )}
          </div>
        </section>

        {/* Log card */}
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-950">System Log</h3>
            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
              Live
            </span>
          </div>
          <div className="flex-1 rounded-3xl bg-slate-950 p-4 font-mono text-xs text-emerald-300 overflow-auto min-h-[180px] space-y-1">
            {logs.length === 0 ? (
              <p className="text-slate-500">[...] Đang khởi động pipeline…</p>
            ) : (
              logs.map((l, i) => <p key={i}>[OK] {l}</p>)
            )}
            {dataset?.status === "processing" && (
              <p className="animate-pulse text-blue-400">[...] {dataset.current_step ?? "Đang chạy…"}</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-400 mt-20">Đang tải…</div>}>
      <ProcessingContent />
    </Suspense>
  );
}
