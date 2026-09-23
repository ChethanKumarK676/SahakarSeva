// Indian-locale number / currency formatters. Reused in every place that
// shows a rupee amount, so the "₹1,234" style is consistent.

export function inr(n: number, opts: { decimals?: number } = {}): string {
  const d = opts.decimals ?? 0;
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: d, minimumFractionDigits: d });
}

export function inrCompact(n: number): string {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1).replace(/\.0$/, "") + "L";
  if (n >= 1000) return "₹" + (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return "₹" + n;
}

export function ago(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + " min ago";
  if (diff < 86400) return Math.floor(diff / 3600) + " h ago";
  if (diff < 604800) return Math.floor(diff / 86400) + " d ago";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export function timeOnly(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function dateLine(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
