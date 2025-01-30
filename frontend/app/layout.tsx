import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Metaverse User Profiling",
  description: "Semi-supervised learning cho phân tích hành vi người dùng Metaverse",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_32%),radial-gradient(circle_at_top_right,#ede9fe,transparent_34%),linear-gradient(180deg,#f8fafc,#eef2ff)] text-slate-900">
        <Header />
        {children}
      </body>
    </html>
  );
}
