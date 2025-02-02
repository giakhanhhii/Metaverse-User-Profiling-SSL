const AD_ICONS: Record<string, string> = {
  "F&B Brands": "🍔", "Meal Delivery": "🛵", "Tourism": "✈️",
  "Airlines": "🛫", "Hotels & Resorts": "🏨", "Apparel & Retail": "👗",
  "Cosmetics": "💄", "Electronics": "💻", "Gaming Platforms": "🎮",
  "Sportswear": "👟", "Gym Memberships": "💪", "Streaming Services": "🎵",
  "Online Learning": "📚", "Pet Food": "🐾", "Banking": "🏦",
};

interface Props {
  ads: string[];
}

export function AdSuggestions({ ads }: Props) {
  if (ads.length === 0) return <p className="text-slate-400 text-sm">Chưa có gợi ý quảng cáo.</p>;
  return (
    <div className="space-y-2">
      {ads.map((ad) => (
        <div key={ad} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
          <span className="text-emerald-600">✓</span>
          <span className="text-sm font-bold text-slate-700">
            {AD_ICONS[ad] ?? "📢"} {ad}
          </span>
        </div>
      ))}
    </div>
  );
}
