type Color = "blue" | "green" | "amber" | "purple" | "red" | "gray";

const palette: Record<Color, string> = {
  blue:   "bg-blue-100 text-blue-800",
  green:  "bg-green-100 text-green-800",
  amber:  "bg-amber-100 text-amber-800",
  purple: "bg-purple-100 text-purple-800",
  red:    "bg-red-100 text-red-800",
  gray:   "bg-gray-100 text-gray-600",
};

export function StatusPill({ label, color = "gray" }: { label: string; color?: Color }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${palette[color]}`}>
      {label}
    </span>
  );
}

export function statusColor(status: string): Color {
  switch (status) {
    case "done":       return "green";
    case "processing": return "blue";
    case "pending":    return "amber";
    case "error":      return "red";
    default:           return "gray";
  }
}
