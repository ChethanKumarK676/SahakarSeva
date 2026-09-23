"use client";

/* CustomerHome
 * The customer's landing screen. Greeting, search bar, live-booking card
 * (if any), open-job card (if any), two CTAs (Post a job, Browse all),
 * the 8-category grid, trusted workers near you, and the monthly impact
 * card.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { KpiCard } from "@/components/KpiCard";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { TRADES } from "@/lib/fairWageFloors";
import { inr, ago } from "@/lib/formatters";
import type { BookingView, WorkerCard } from "@/lib/types";

const CATEGORIES = TRADES.map((skill) => ({ skill, icon: iconFor(skill) }));

function iconFor(skill: string) {
  return {
    Electrician: "💡",
    Plumber: "🔧",
    Carpenter: "🪚",
    Painter: "🖌",
    "Domestic Help": "🧹",
    Driver: "🚗",
    Gardener: "🌿",
    Cleaner: "🧽"
  }[skill] ?? "🛠";
}

export function CustomerHome({
  customerName,
  onBrowse,
  onPostJob,
  onWorker,
  onBooking
}: {
  customerName: string;
  onBrowse: () => void;
  onPostJob: () => void;
  onWorker: (id: string) => void;
  onBooking: (id: string) => void;
}) {
  const router = useRouter();
  const [active, setActive] = useState<BookingView | null>(null);
  const [openJobsCount, setOpenJobsCount] = useState(0);
  const [trusted, setTrusted] = useState<WorkerCard[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [bookings, requests, workers] = await Promise.all([
        fetch("/api/bookings").then((r) => r.json()),
        fetch("/api/requests").then((r) => r.json()),
        fetch("/api/workers").then((r) => r.json())
      ]);
      if (cancelled) return;
      const live = (bookings.bookings as BookingView[]).find(
        (b) => b.status === "IN_PROGRESS" || b.status === "ACCEPTED" || b.status === "BOOKED"
      );
      setActive(live ?? null);
      setOpenJobsCount((requests.requests as unknown[]).filter((r: any) => r.status === "PENDING").length);
      setTrusted((workers.workers as WorkerCard[]).slice(0, 3));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const firstName = customerName.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex-1 overflow-y-auto bg-ink-50">
      {/* Greeting + search */}
      <div className="px-5 pt-3 pb-2 bg-white">
        <div className="text-[12px] text-ink-500">{greeting},</div>
        <div className="text-[18px] font-semibold text-ink-900">{firstName} 👋</div>
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Search a service, worker, or locality"
            onFocus={onBrowse}
            readOnly
            className="w-full rounded-full bg-ink-50 border border-ink-100 pl-9 pr-3 py-2.5 text-[12px] text-ink-700 placeholder-ink-500"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 text-sm">🔍</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Live booking card */}
        {active ? (
          <div className="rounded-2xl bg-ink-900 text-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <Pill tone="orange">Live booking</Pill>
              <Pill tone="muted" className="!bg-white/10 !text-white">
                {active.status.replace("_", " ")}
              </Pill>
            </div>
            <div className="mt-2 text-[14px] font-semibold">
              {active.skill} · {active.locality}
            </div>
            <div className="text-[12px] text-ink-200">with {active.worker.name}</div>
            <div className="mt-3">
              <MapPlaceholder etaMinutes={active.etaMinutes} height={92} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-[12px] text-ink-200">
                Total <span className="text-white font-semibold">{inr(active.amount)}</span>
              </div>
              <button
                onClick={() => onBooking(active.id)}
                className="bg-orange-500 hover:bg-orange-400 text-white text-[12px] font-semibold rounded-full px-3 py-1.5"
              >
                Open
              </button>
            </div>
          </div>
        ) : null}

        {/* Open job card */}
        {openJobsCount > 0 ? (
          <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <Pill tone="green">Open job</Pill>
              <span className="text-[10px] text-ink-500">{openJobsCount} pending</span>
            </div>
            <div className="mt-2 text-[14px] font-semibold text-ink-900">
              Your job post is live — workers can accept any time.
            </div>
            <button
              onClick={onPostJob}
              className="mt-2 text-[12px] font-semibold text-orange-500"
            >
              View / edit →
            </button>
          </div>
        ) : null}

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onPostJob}
            className="rounded-2xl bg-orange-500 hover:bg-orange-400 text-white p-4 text-left shadow-card active:scale-[0.99] transition"
          >
            <div className="text-[18px]">📝</div>
            <div className="mt-1 text-[13px] font-semibold leading-tight">Post a job</div>
            <div className="text-[10px] text-white/85">Workers come to you</div>
          </button>
          <button
            onClick={onBrowse}
            className="rounded-2xl bg-green-700 hover:bg-green-600 text-white p-4 text-left shadow-card active:scale-[0.99] transition"
          >
            <div className="text-[18px]">🔎</div>
            <div className="mt-1 text-[13px] font-semibold leading-tight">Browse all</div>
            <div className="text-[10px] text-white/85">Pick a verified worker</div>
          </button>
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-[13px] font-semibold text-ink-900">Browse by service</div>
            <button onClick={onBrowse} className="text-[11px] text-orange-500 font-semibold">
              See all
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.skill}
                onClick={onBrowse}
                className="aspect-square rounded-2xl bg-white border border-ink-100 shadow-card flex flex-col items-center justify-center p-1.5 active:scale-95 transition"
              >
                <span className="text-xl">{c.icon}</span>
                <span className="mt-1 text-[10px] text-ink-700 text-center leading-tight">
                  {c.skill}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Trusted workers near you */}
        {trusted.length > 0 ? (
          <div>
            <div className="text-[13px] font-semibold text-ink-900 mb-2">
              Trusted workers near you
            </div>
            <div className="space-y-2">
              {trusted.map((w) => (
                <button
                  key={w.id}
                  onClick={() => onWorker(w.id)}
                  className="w-full text-left rounded-2xl bg-white border border-ink-100 p-3 shadow-card flex items-center gap-3 active:scale-[0.99] transition"
                >
                  <Avatar name={w.name} hue={w.avatarHue} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold text-ink-900 truncate">
                        {w.name}
                      </span>
                      <Pill tone="green">✓</Pill>
                    </div>
                    <div className="text-[11px] text-ink-500 truncate">
                      {w.skill} · {w.locality} · ⭐ {w.rating.toFixed(1)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] font-semibold text-ink-900">
                      {inr(w.standardRate)}
                    </div>
                    <div className="text-[9px] text-ink-500">per visit</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Impact card */}
        <div className="rounded-2xl bg-green-50 border border-green-700/15 p-4">
          <div className="text-[11px] font-semibold text-green-700 uppercase tracking-wider">
            Your impact this month
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-[24px] font-bold text-ink-900">₹420</div>
            <div className="text-[11px] text-ink-700">extra paid to workers</div>
          </div>
          <div className="text-[11px] text-ink-700 leading-snug mt-1">
            vs. the same bookings on a 25% commission platform. Owned by the
            cooperatives, not by investors.
          </div>
        </div>
      </div>
    </div>
  );
}
