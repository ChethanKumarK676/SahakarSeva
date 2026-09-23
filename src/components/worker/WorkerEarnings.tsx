"use client";

/* WorkerEarnings
 * This week / In escrow / Paid out / Welfare (yr) KPIs, recent payouts.
 */
import { useEffect, useState } from "react";
import { KpiCard } from "@/components/KpiCard";
import { inr, ago, dateLine } from "@/lib/formatters";
import type { EarningView } from "@/lib/types";

export function WorkerEarnings() {
  const [earnings, setEarnings] = useState<EarningView[]>([]);

  useEffect(() => {
    fetch("/api/earnings")
      .then((r) => r.json())
      .then((d) => setEarnings(d.earnings));
  }, []);

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);
  const yearStart = new Date(today.getFullYear(), 0, 1);

  const week = earnings
    .filter((e) => new Date(e.createdAt) >= weekStart)
    .reduce((s, e) => s + e.amount, 0);
  const escrow = earnings
    .filter((e) => e.status === "IN_ESCROW")
    .reduce((s, e) => s + e.amount, 0);
  const paid = earnings
    .filter((e) => e.status === "PAID_OUT")
    .reduce((s, e) => s + e.amount, 0);
  const welfareYr = Math.round(paid * 0.005); // 0.5% welfare contribution

  return (
    <div className="flex-1 overflow-y-auto bg-ink-50">
      <div className="px-5 pt-4 pb-2">
        <div className="text-[18px] font-semibold text-ink-900">Earnings</div>
        <div className="text-[11px] text-ink-500 mt-0.5">
          95% of every booking is yours. The 5% that stays funds the
          cooperative.
        </div>
      </div>
      <div className="p-4 grid grid-cols-2 gap-2">
        <KpiCard label="This week" value={inr(week)} hint="After 95% split" tone="green" icon="₹" />
        <KpiCard label="In escrow" value={inr(escrow)} hint="Released on completion" icon="🕒" />
        <KpiCard label="Paid out" value={inr(paid)} hint="Total released" tone="default" icon="🏦" />
        <KpiCard label="Welfare (yr)" value={inr(welfareYr)} hint="Cooperative top-up" tone="orange" icon="🛡" />
      </div>

      <div className="px-4">
        <div className="text-[10px] font-semibold text-ink-500 uppercase tracking-wider mb-1.5 px-1">
          Recent payouts
        </div>
        <div className="rounded-2xl bg-white border border-ink-100 shadow-card divide-y divide-ink-100 overflow-hidden">
          {earnings.length === 0 ? (
            <div className="px-5 py-6 text-center text-ink-500 text-[12px]">
              No earnings yet.
            </div>
          ) : (
            earnings.map((e) => (
              <div key={e.id} className="px-3 py-3 flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    e.status === "IN_ESCROW"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {e.status === "IN_ESCROW" ? "🕒" : "✅"}
                </div>
                <div className="flex-1">
                  <div className="text-[12px] text-ink-700">{dateLine(e.createdAt)}</div>
                  <div className="text-[10px] text-ink-500">
                    Gross {inr(e.gross)} · platform kept {inr(e.gross - e.amount)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-ink-900">
                    {inr(e.amount)}
                  </div>
                  <div className="text-[9px] text-ink-500">{ago(e.createdAt)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
