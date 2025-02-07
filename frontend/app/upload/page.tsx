"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DropZone } from "@/components/upload/DropZone";
import { DatasetStatus } from "@/components/upload/DatasetStatus";
import { Button } from "@/components/ui/Button";
import { uploadDataset, startProcessing } from "@/lib/api";
import type { Dataset } from "@/lib/types";

export default function UploadPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!file.name.endsWith(".zip")) { setError("Chỉ chấp nhận file .zip"); return; }
    setError(null);
    setUploading(true);
    setUploadProgress(0);
    try {
      const res = await uploadDataset(file, setUploadProgress);
      setDataset(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "Tải lên thất bại.");
    } finally {
      setUploading(false);
    }
  }

  async function handleProcess() {
    if (!dataset) return;
    await startProcessing(dataset.id);
    router.push(`/processing?id=${dataset.id}`);
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Left: drop zone card */}
      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-7 shadow-2xl shadow-slate-200/70 backdrop-blur">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
              Upload Dataset
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Tải ảnh người dùng</h2>
            <p className="mt-2 max-w-xl text-slate-500">
              Chọn một file ZIP chứa ảnh theo cấu trúc <code className="bg-slate-100 px-1 rounded">user_001/img.jpg</code>. Tối đa 10.000 ảnh.
            </p>
          </div>
          <div className="hidden rounded-3xl bg-gradient-to-br from-blue-50 to-violet-50 p-4 text-4xl md:block">🗂️</div>
        </div>

        <DropZone onFile={handleFile} uploading={uploading} uploadProgress={uploadProgress} />

        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-semibold">
            ⚠️ {error}
          </div>
        )}

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            ["Định dạng", "JPG / PNG / WEBP"],
            ["Giới hạn", "Tối đa 10.000 ảnh"],
            ["Đề xuất", "100+ ảnh để ổn hơn"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{k}</p>
              <p className="mt-1 font-black text-slate-800">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Right: info + status */}
      <section className="space-y-5">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-950">Thông tin nghiên cứu</h3>
            <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
              Semi-supervised
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["Project", "User Feature Analysis"],
              ["Goal", "Personalized Advertising"],
              ["Platform", "Facebook / Metaverse"],
              ["Output", "Interest labels + Ad suggestions"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-bold text-slate-500">{k}</span>
                <span className="text-sm font-black text-slate-900">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-950">Dataset Status</h3>
            {dataset ? (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">Ready</span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">Waiting</span>
            )}
          </div>

          {dataset ? (
            <div className="space-y-4">
              <DatasetStatus dataset={dataset} />
              <Button onClick={handleProcess} className="w-full" disabled={dataset.valid_images === 0} icon="▶️">
                Start Analysis
              </Button>
            </div>
          ) : (
            <div className="rounded-3xl bg-slate-50 p-6 text-center text-slate-500">
              <div className="mb-3 text-4xl">🗄️</div>
              Chưa có dataset. Hãy chọn ZIP file để bắt đầu.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
