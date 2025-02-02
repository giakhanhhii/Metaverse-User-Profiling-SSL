"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/upload",     label: "Upload" },
  { href: "/processing", label: "Pipeline" },
  { href: "/results",    label: "Kết quả" },
  { href: "/detail",     label: "Chi tiết ảnh" },
  { href: "/export",     label: "Xuất báo cáo" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-xl text-white shadow-lg">
            ✦
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-950">Metaverse User Feature Analyzer</h1>
            <p className="text-xs font-medium text-slate-500">Phân tích ảnh người dùng để cá nhân hoá quảng cáo</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-2xl bg-slate-100 p-1 md:flex">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  active ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/export"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          ⬇️ Export
        </Link>
      </div>
    </header>
  );
}
