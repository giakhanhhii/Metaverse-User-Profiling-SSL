"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { listImages, getImage, imageUrl } from "@/lib/api";
import { PredictionTable } from "@/components/detail/PredictionTable";
import { Button } from "@/components/ui/Button";
import type { ImageItem, ImageListOut } from "@/lib/types";

function DetailContent() {
  const params = useSearchParams();
  const datasetId = params.get("id") ?? "";
  const filterUser = params.get("user") ?? undefined;

  const [list, setList] = useState<ImageListOut | null>(null);
  const [selected, setSelected] = useState<ImageItem | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(filterUser ?? "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!datasetId) return;
    setLoading(true);
    listImages(datasetId, page, 20, search || undefined)
      .then((r) => {
        setList(r.data);
        if (r.data.items[0] && !selected) setSelected(r.data.items[0]);
      })
      .finally(() => setLoading(false));
  }, [datasetId, page, search]);

  async function selectImage(img: ImageItem) {
    const full = await getImage(datasetId, img.id);
    setSelected(full.data);
  }

  if (!datasetId) return <div className="text-center text-slate-400 mt-20">Không có dataset.</div>;

  const bestPred = selected?.predictions?.sort((a, b) => b.confidence - a.confidence)[0];

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
            Image Detail Analysis
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Chi tiết dự đoán theo từng ảnh</h2>
          <p className="mt-2 text-slate-500">Kiểm tra nhãn, confidence và gợi ý quảng cáo cho từng ảnh.</p>
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
          <input
            className="h-12 rounded-2xl border border-slate-200 bg-white/80 pl-11 pr-4 text-sm font-medium shadow-sm outline-none focus:border-blue-300 backdrop-blur"
            placeholder="Tìm theo user_id…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        {/* Sidebar: image list */}
        <section className="rounded-[2rem] border border-white/70 bg-white/80 backdrop-blur shadow-xl shadow-slate-200/60 flex flex-col overflow-hidden" style={{ maxHeight: "calc(100vh - 200px)" }}>
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-950 mb-3">Image List</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-slate-400 text-sm">Đang tải…</div>
            ) : (list?.items ?? []).map((img) => (
              <button
                key={img.id}
                onClick={() => selectImage(img)}
                className={`flex w-full items-center gap-3 p-3 text-left transition hover:-translate-y-0.5 border-b border-slate-50 ${
                  selected?.id === img.id ? "bg-blue-50" : "hover:bg-slate-50"
                }`}
              >
                <div className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-slate-100 to-blue-50 text-2xl text-slate-400">🖼️</div>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-slate-900 text-sm truncate">{img.file_name}</p>
                  <p className="text-xs text-slate-400">{img.user_id}</p>
                  {img.predictions[0] && (
                    <span className="mt-1 inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700 ring-1 ring-violet-200 capitalize">
                      {img.predictions[0].predicted_label}
                    </span>
                  )}
                </div>
                {img.predictions[0] && (
                  <span className="flex-shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                    {Math.round(img.predictions[0].confidence * 100)}%
                  </span>
                )}
              </button>
            ))}
          </div>
          {list && list.total > 20 && (
            <div className="p-3 border-t border-slate-100 flex items-center justify-between">
              <Button variant="secondary" className="text-xs px-3 py-2" disabled={page === 1} onClick={() => setPage(p => p - 1)}>←</Button>
              <span className="text-xs font-bold text-slate-500">{page}/{Math.ceil(list.total / 20)}</span>
              <Button variant="secondary" className="text-xs px-3 py-2" disabled={page >= Math.ceil(list.total / 20)} onClick={() => setPage(p => p + 1)}>→</Button>
            </div>
          )}
        </section>

        {/* Main: preview + predictions */}
        <div className="space-y-5">
          {selected ? (
            <>
              <section className="rounded-[2rem] border border-white/70 bg-white/80 backdrop-blur shadow-xl shadow-slate-200/60 p-6">
                <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
                  <div>
                    <div className="grid aspect-square place-items-center rounded-[2rem] bg-gradient-to-br from-slate-100 via-blue-50 to-violet-50 text-7xl text-slate-300 overflow-hidden">
                      <img
                        src={imageUrl(datasetId, selected.user_id, selected.file_name)}
                        alt={selected.file_name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).replaceWith(Object.assign(document.createElement("div"), { textContent: "🖼️", className: "text-7xl text-slate-300 grid place-items-center w-full h-full" })); }}
                      />
                    </div>
                    <div className="mt-4 rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase text-slate-400">File name</p>
                      <p className="mt-1 font-black text-slate-950 truncate">{selected.file_name}</p>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-bold text-slate-400">User</p>
                          <p className="font-black text-slate-800 text-sm truncate">{selected.user_id}</p>
                        </div>
                        {bestPred && (
                          <div>
                            <p className="text-xs font-bold text-slate-400">Confidence</p>
                            <p className="font-black text-blue-700">{Math.round(bestPred.confidence * 100)}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-950">Predicted Features</h3>
                    {bestPred && (
                      <div className="mt-4 space-y-3">
                        {[
                          ["Category",      bestPred.predicted_label],
                          ["Status",        "Valid"],
                          ["Top Confidence",`${Math.round(bestPred.confidence * 100)}%`],
                          ["Advertising potential", bestPred.confidence >= 0.85 ? "High" : "Medium"],
                        ].map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                            <span className="text-sm font-bold text-slate-500">{k}</span>
                            <span className="text-sm font-black text-slate-950 capitalize">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/70 bg-white/80 backdrop-blur shadow-xl shadow-slate-200/60 p-6">
                <h3 className="text-xl font-black text-slate-950 mb-4">Dự đoán từng mô hình</h3>
                <PredictionTable predictions={selected.predictions} />
              </section>
            </>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-[2rem] border border-white/70 bg-white/80 backdrop-blur text-slate-400">
              Chọn ảnh từ danh sách bên trái
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function DetailPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-400 mt-20">Đang tải…</div>}>
      <DetailContent />
    </Suspense>
  );
}
