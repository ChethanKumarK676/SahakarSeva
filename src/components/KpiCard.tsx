/* KpiCard
 * The small 2-line metric tile used on both the customer home and the
 * worker today screens.
 */
import type { ReactNode } from "react";

export function KpiCard({
  label,
  value,
  hint,
  tone = "default",
  icon
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "green" | "orange" | "warn";
  icon?: string;
}) {
  const toneClass =
    tone === "green"
      ? "bg-green-50 text-green-700"
      : tone === "orange"
      ? "bg-orange-100 text-orange-600"
      : tone === "warn"
      ? "bg-amber-50 text-amber-700"
      : "bg-ink-50 text-ink-700";
  return (
    <div className="rounded-2xl bg-white border border-ink-100 p-3 shadow-card">
      <div className={`text-[10px] font-semibold inline-flex items-center gap-1 ${toneClass} rounded-full px-2 py-0.5`}>
        {icon ? <span>{icon}</span> : null}
        {label}
      </div>
      <div className="mt-1.5 text-[18px] font-bold text-ink-900 leading-tight">{value}</div>
      {hint ? <div className="text-[10px] text-ink-500 mt-0.5">{hint}</div> : null}
    </div>
  );
}
