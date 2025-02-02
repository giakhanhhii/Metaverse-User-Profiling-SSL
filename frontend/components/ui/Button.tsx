import { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  children: ReactNode;
  icon?: string;
}

const base = "inline-flex items-center justify-center gap-2 font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
  primary:
    "rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-3 text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 hover:shadow-xl disabled:hover:translate-y-0",
  secondary:
    "rounded-2xl border border-slate-200 bg-white px-5 py-3 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
  danger:
    "rounded-2xl bg-red-600 px-5 py-3 text-white shadow-sm hover:-translate-y-0.5",
};

export function Button({ variant = "primary", children, icon, className = "", ...props }: Props) {
  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
