import type { UserFeature } from "@/lib/types";

interface Props {
  user: UserFeature;
  onClick?: () => void;
  selected?: boolean;
}

export function UserProfileCard({ user, onClick, selected }: Props) {
  return (
    <div
      onClick={onClick}
      className={`rounded-[2rem] border bg-white/80 backdrop-blur p-5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl ${
        selected
          ? "border-blue-300 shadow-xl shadow-blue-100"
          : "border-white/70 shadow-lg shadow-slate-200/60"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white text-sm font-black shadow-lg">
            {user.user_id.slice(-2).toUpperCase()}
          </div>
          <span className="font-black text-slate-950">{user.user_id}</span>
        </div>
        <span className="text-xs font-bold text-slate-400">{user.total_images} ảnh</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {user.top_interests.slice(0, 4).map((t) => (
          <span key={t} className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200 capitalize">
            {t}
          </span>
        ))}
      </div>

      <div className="space-y-1.5">
        {user.recommended_ads.slice(0, 2).map((ad) => (
          <div key={ad} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="text-emerald-500">✓</span> {ad}
          </div>
        ))}
      </div>
    </div>
  );
}
