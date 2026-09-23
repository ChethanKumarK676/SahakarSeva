"use client";

/* ActiveJobCard
 * The worker's view of a single active job. Live-tracking map + ETA,
 * customer card with Call, safety check-in with auto-escalation copy,
 * per-job payout breakdown, Mark completed.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { StatusStepper } from "@/components/StatusStepper";
import { SplitBar } from "@/components/SplitBar";
import { Modal } from "@/components/Modal";
import { inr, timeOnly, ago } from "@/lib/formatters";
import type { BookingView } from "@/lib/types";

export function ActiveJobCard({
  booking,
  onBack,
  onSOS
}: {
  booking: BookingView;
  onBack: () => void;
  onSOS: () => void;
}) {
  const router = useRouter();
  const [now, setNow] = useState(Date.now());
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, []);

  const lastCheckIn = booking.lastCheckInAt ? new Date(booking.lastCheckInAt).getTime() : null;
  const minutesSinceCheckIn = lastCheckIn ? Math.floor((now - lastCheckIn) / 60000) : null;
  const checkInOverdue = minutesSinceCheckIn !== null && minutesSinceCheckIn >= 15;

  async function patch(action: string) {
    setWorking(true);
    await fetch(`/api/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action })
    });
    setWorking(false);
    router.refresh();
  }

  return (
    <div className="flex-1 overflow-y-auto bg-ink-50">
      <div className="px-4 pt-3 pb-2 bg-white flex items-center gap-2 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-ink-50 text-ink-700 flex items-center justify-center"
        >
          ‹
        </button>
        <div className="text-[13px] font-semibold text-ink-900">Active job</div>
      </div>

      <div className="p-4 space-y-3">
        <div className="rounded-2xl bg-white border border-ink-100 p-4 shadow-card">
          <div className="flex items-center justify-between">
            <Pill tone="orange">{booking.status.replace("_", " ")}</Pill>
            <span className="text-[10px] text-ink-500">Started {timeOnly(booking.startedAt)}</span>
          </div>
          <div className="mt-2 text-[16px] font-semibold text-ink-900">
            {booking.skill} · {booking.locality}
          </div>
          <div className="mt-3">
            <StatusStepper status={booking.status} />
          </div>
        </div>

        {/* Customer card */}
        <div className="rounded-2xl bg-white border border-ink-100 p-4 shadow-card">
          <div className="flex items-center gap-3">
            <Avatar name={booking.customer.name} hue={booking.customer.avatarHue} size={56} />
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-ink-900">
                {booking.customer.name}
              </div>
              <div className="text-[11px] text-ink-500">{booking.customer.phone}</div>
            </div>
            <a
              href={`tel:${booking.customer.phone}`}
              className="w-10 h-10 rounded-full bg-green-700 text-white text-lg flex items-center justify-center"
            >
              📞
            </a>
          </div>
        </div>

        {/* Safety check-in */}
        <div
          className={`rounded-2xl border p-4 ${
            checkInOverdue
              ? "bg-danger-500/5 border-danger-500/30"
              : "bg-white border-ink-100"
          } shadow-card`}
        >
          <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
            Safety check-in
          </div>
          <div className="mt-1 text-[12px] text-ink-700 leading-snug">
            Last check-in:{" "}
            <span className="font-semibold text-ink-900">
              {lastCheckIn ? ago(booking.lastCheckInAt!) : "—"}
            </span>
          </div>
          {checkInOverdue ? (
            <div className="mt-2 text-[11px] text-danger-500 font-semibold">
              ⚠ Missed check-in. The customer will be auto-called, then the
              safety desk, then police.
            </div>
          ) : null}
          <button
            onClick={() => patch("checkin")}
            disabled={working}
            className="mt-3 w-full bg-green-700 hover:bg-green-600 text-white text-[13px] font-semibold rounded-full py-2.5 disabled:opacity-60"
          >
            {working ? "Updating…" : "I'm safe"}
          </button>
        </div>

        {/* Payout breakdown */}
        <div className="rounded-2xl bg-white border border-ink-100 p-4 shadow-card">
          <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
            Your payout for this job
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-[12px] text-ink-700">You earn</div>
            <div className="text-[18px] font-bold text-ink-900">
              {inr(Math.round(booking.amount * 0.95))}
            </div>
          </div>
          <div className="mt-3">
            <SplitBar amount={booking.amount} />
          </div>
          <div className="mt-3 text-[10px] text-ink-500">
            {booking.inEscrow
              ? "Held in escrow until the customer confirms."
              : "Released to your wallet."}
          </div>
        </div>

        {booking.status === "ACCEPTED" ? (
          <button
            onClick={() => patch("start")}
            disabled={working}
            className="w-full bg-orange-500 hover:bg-orange-400 text-white text-[14px] font-semibold rounded-full py-3 disabled:opacity-60"
          >
            ▶ Start job
          </button>
        ) : null}
        {booking.status === "IN_PROGRESS" ? (
          <button
            onClick={() => patch("complete")}
            disabled={working}
            className="w-full bg-green-700 hover:bg-green-600 text-white text-[14px] font-semibold rounded-full py-3 disabled:opacity-60"
          >
            {working ? "Marking…" : "Mark completed"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
