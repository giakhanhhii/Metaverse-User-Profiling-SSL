"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MetricCard } from "@/components/ui/MetricCard";
import { FeatureBarChart } from "@/components/results/FeatureBarChart";
import { AdSuggestions } from "@/components/results/AdSuggestions";
import { UserProfileCard } from "@/components/results/UserProfileCard";
import { Button } from "@/components/ui/Button";
import { getDataset, listUsers, getMetrics } from "@/lib/api";
import type { Dataset, UserFeature, ModelMetric } from "@/lib/types";

function ResultsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const datasetId = params.get("id") ?? "";

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [users, setUsers] = useState<UserFeature[]>([]);
  const [metrics, setMetrics] = useState<ModelMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!datasetId) return;
    Promise.all([getDataset(datasetId), listUsers(datasetId), getMetrics(datasetId)])
      .then(([ds, us, mt]) => { setDataset(ds.data); setUsers(us.data); setMetrics(mt.data); })
      .finally(() => setLoading(false));
  }, [datasetId]);

  if (!datasetId) return <div className="text-center text-slate-400 mt-20">Không có dataset.</div>;
  if (loading)    return <div className="text-center text-slate-400 mt-20">Đang tải kết quả…</div>;
  if (!dataset)   return <div className="text-center text-red-400 mt-20">Không tìm thấy dataset.</div>;

  const globalDist = users.reduce<Record<string, number>>((acc, u) => {
    for (const [k, v] of Object.entries(u.interest_distribution)) acc[k] = (acc[k] ?? 0) + v * u.total_images;
    return acc;
  }, {});
  const totalImgs = users.reduce((s, u) => s + u.total_images, 0);
  if (totalImgs > 0) for (const k of Object.keys(globalDist)) globalDist[k] /= totalImgs;

  const topLabel = Object.entries(globalDist).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "-";
  const bestMetric = metrics[0];
  const allAds = [...new Set(users.flatMap((u) => u.recommended_ads))].slice(0, 6);

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            Analysis Result
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Kết quả phân tích đặc trưng người dùng</h2>
          <p className="mt-2 text-slate-500">{dataset.name}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => router.push(`/detail?id=${datasetId}`)} icon="🔍">
            Chi tiết ảnh
          </Button>
          <Link href={`/export?id=${datasetId}`}>
            <Button icon="⬇️">Xuất báo cáo</Button>
          </Link>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard icon="🖼️" label="Tổng ảnh hợp lệ" value={dataset.valid_images} gradient="from-blue-500 to-cyan-400" />
        <MetricCard icon="👥" label="Người dùng" value={users.length} gradient="from-violet-500 to-fuchsia-400" />
        <MetricCard icon="✦" label="Sở thích chính" value={topLabel} gradient="from-pink-500 to-rose-400" />
        <MetricCard
          icon="📊"
          label="F1 tốt nhất"
          value={bestMetric ? `${(bestMetric.f1_score * 100).toFixed(1)}%` : "-"}
          sub={bestMetric?.model_name?.replace(/_/g, " ")}
          gradient="from-amber-500 to-orange-400"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr] mb-6">
        {/* Feature distribution */}
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-950">User Feature Distribution</h3>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
              Interest Categories
            </span>
          </div>
          {totalImgs > 0 ? <FeatureBarChart distribution={globalDist} /> : <p className="text-slate-400 text-sm">Chưa có dữ liệu.</p>}
        </section>

        {/* Ad suggestions + model table */}
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-950 mb-2">Personalized Advertising</h3>
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 p-5 text-white shadow-lg shadow-blue-500/30 mb-4">
              <p className="text-sm font-semibold text-blue-100">Phân khúc quảng cáo gợi ý</p>
              <p className="mt-1 text-lg font-black">
                {allAds.length > 0 ? allAds.slice(0, 2).join(" · ") : "Chưa có dữ liệu"}
              </p>
            </div>
            <AdSuggestions ads={allAds} />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-950 mb-3">So sánh mô hình</h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500">
                    <th className="px-4 py-3 text-left font-bold">Mô hình</th>
                    <th className="px-4 py-3 text-right font-bold">Acc</th>
                    <th className="px-4 py-3 text-right font-bold">F1</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {metrics.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-bold text-slate-700 capitalize">{m.model_name.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3 text-right text-slate-500">{(m.accuracy * 100).toFixed(1)}%</td>
                      <td className="px-4 py-3 text-right font-black text-blue-700">{(m.f1_score * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* User profile grid */}
      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-950">Hồ sơ người dùng</h3>
          <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
            {users.length} users
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.slice(0, 12).map((u) => (
            <UserProfileCard
              key={u.id}
              user={u}
              onClick={() => router.push(`/detail?id=${datasetId}&user=${u.user_id}`)}
            />
          ))}
        </div>
        {users.length > 12 && (
          <p className="text-xs text-slate-400 mt-4 text-center">Hiển thị 12/{users.length} người dùng</p>
        )}
      </section>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-400 mt-20">Đang tải…</div>}>
      <ResultsContent />
    </Suspense>
  );
}
