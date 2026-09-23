/* Pill
 * Small inline status / category label. Tones map to the cooperative
 * palette so a row of pills feels coherent.
 */
import type { ReactNode } from "react";

export function Pill({
  children,
  tone = "default",
  className = ""
}: {
  children: ReactNode;
  tone?: "default" | "green" | "orange" | "warn" | "danger" | "muted";
  className?: string;
}) {
  const toneClass =
    tone === "green"
      ? "bg-green-700 text-white"
      : tone === "orange"
      ? "bg-orange-500 text-white"
      : tone === "warn"
      ? "bg-amber-100 text-amber-700"
      : tone === "danger"
      ? "bg-red-100 text-red-700"
      : tone === "muted"
      ? "bg-ink-100 text-ink-700"
      : "bg-green-100 text-green-700";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 ${toneClass} ${className}`}
    >
      {children}
    </span>
  );
}
