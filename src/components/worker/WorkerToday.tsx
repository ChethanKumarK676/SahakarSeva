"use client";

/* WorkerToday
 * Greeting + cooperative name, 4-tile KPI grid, new-job-requests feed
 * with auto-decline timer, active job card.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { KpiCard } from "@/components/KpiCard";
import { inr, ago } from "@/lib/formatters";
import { getFloor } from "@/lib/fairWageFloors";
import type { BookingView, EarningView, RequestView } from "@/lib/types";

export function WorkerToday({
  workerName,
  cooperative,
  rating,
  onBooking
}: {
  workerName: string;
  cooperative: string;
  rating: number;
  onBooking: (id: string) => void;
}) {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestView[]>([]);
  const [active, setActive] = useState<BookingView | null>(null);
  const [earnings, setEarnings] = useState<EarningView[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [req, bk, er] = await Promise.all([
        fetch("/api/requests").then((r) => r.json()),
        fetch("/api/bookings").then((r) => r.json()),
        fetch("/api/earnings").then((r) => r.json())
      ]);
      if (cancelled) return;
      setRequests(
        (req.requests as any[]).filter((r) => r.status === "PENDING") as RequestView[]
      );
      setActive(
        (bk.bookings as BookingView[]).find(
          (b) => b.status === "IN_PROGRESS" || b.status === "ACCEPTED" || b.status === "BOOKED"
        ) ?? null
      );
      setEarnings(er.earnings as EarningView[]);
    };
    load();
    const t = setInterval(load, 8000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const firstName = workerName.split(" ")[0];
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEarnings = earnings
    .filter((e) => new Date(e.createdAt) >= todayStart)
    .reduce((s, e) => s + e.amount, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);
  const weekEarnings = earnings
    .filter((e) => new Date(e.createdAt) >= weekStart)
    .reduce((s, e) => s + e.amount, 0);

  return (
    <div className="flex-1 overflow-y-auto bg-ink-50">
      <div className="px-5 pt-4 pb-3 bg-white">
        <div className="text-[12px] text-ink-500">Good day,</div>
        <div className="text-[18px] font-semibold text-ink-900">{firstName} 👋</div>
        <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-green-700 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-green-700" />
          {cooperative}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-2">
          <KpiCard
            label="Today"
            value={inr(todayEarnings)}
            hint="After 95% split"
            tone="green"
            icon="₹"
          />
          <KpiCard
            label="This week"
            value={inr(weekEarnings)}
            hint="After 95% split"
            tone="default"
            icon="📈"
          />
          <KpiCard
            label="Rating"
            value={`⭐ ${rating.toFixed(1)}`}
            hint="Customer reviews"
            tone="default"
            icon="★"
          />
          <KpiCard
            label="Welfare"
            value="Active"
            hint="ESIC + PM-JAY"
            tone="orange"
            icon="🛡"
          />
        </div>

        {/* New job requests */}
        {requests.length > 0 ? (
          <div>
            <div className="text-[13px] font-semibold text-ink-900 mb-2">
              New job requests
            </div>
            <div className="space-y-2">
              {requests.map((r) => (
                <RequestRow
                  key={r.id}
                  request={r}
                  onResponded={() => router.refresh()}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* Active job */}
        {active ? (
          <div>
            <div className="text-[13px] font-semibold text-ink-900 mb-2">Active job</div>
            <button
              onClick={() => onBooking(active.id)}
              className="w-full text-left rounded-2xl bg-ink-900 text-white p-4 shadow-card"
            >
              <div className="flex items-center justify-between">
                <Pill tone="orange">Active</Pill>
                <span className="text-[10px] text-ink-200">{ago(active.createdAt)}</span>
              </div>
              <div className="mt-2 text-[14px] font-semibold">
                {active.skill} · {active.locality}
              </div>
              <div className="text-[11px] text-ink-200">with {active.customer.name}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-[11px] text-ink-200">
                  You earn <span className="text-white font-semibold">{inr(Math.round(active.amount * 0.95))}</span>
                </div>
                <span className="text-[11px] text-orange-400 font-semibold">Open →</span>
              </div>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RequestRow({ request, onResponded }: { request: RequestView; onResponded: () => void }) {
  const [busy, setBusy] = useState(false);
  const createdAt = new Date(request.createdAt).getTime();
  const [secondsLeft, setSecondsLeft] = useState(() => Math.max(0, 270 - Math.floor((Date.now() - createdAt) / 1000)));

  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft(Math.max(0, 270 - Math.floor((Date.now() - createdAt) / 1000)));
    }, 1000);
    return () => clearInterval(t);
  }, [createdAt]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const expiring = secondsLeft <= 30;

  async function respond(action: "accept" | "decline") {
    setBusy(true);
    await fetch(`/api/requests/${request.id}/respond`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action })
    });
    setBusy(false);
    onResponded();
  }

  return (
    <div className="rounded-2xl bg-white border border-ink-100 p-3 shadow-card">
      <div className="flex items-center justify-between">
        <Pill tone="orange">{request.skill}</Pill>
        <span
          className={`text-[10px] font-mono font-semibold ${
            expiring ? "text-danger-500" : "text-ink-500"
          }`}
        >
          auto-decline in {mins}:{secs.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <Avatar name={request.customer.name} hue={request.customer.avatarHue} />
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-ink-900">
            {request.customer.name}
          </div>
          <div className="text-[11px] text-ink-500">
            {request.locality} · {request.window}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[13px] font-semibold text-ink-900">{inr(request.budget)}</div>
          <div className="text-[9px] text-ink-500">budget</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          disabled={busy}
          onClick={() => respond("decline")}
          className="rounded-full bg-ink-50 text-ink-700 text-[12px] font-semibold py-2 disabled:opacity-60"
        >
          Decline
        </button>
        <button
          disabled={busy}
          onClick={() => respond("accept")}
          className="rounded-full bg-green-700 text-white text-[12px] font-semibold py-2 disabled:opacity-60"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
