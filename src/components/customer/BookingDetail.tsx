"use client";

/* BookingDetail
 * The full booking detail page. Status stepper, payment breakdown with
 * 95/5 split, worker card with Call + SOS, "Mark completed" / "Rate" CTAs.
 * The state machine actions (accept/start/complete) live here too.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { StatusStepper } from "@/components/StatusStepper";
import { SplitBar } from "@/components/SplitBar";
import { SOSButton } from "@/components/SOSButton";
import { Modal } from "@/components/Modal";
import { inr, timeOnly, dateLine } from "@/lib/formatters";
import type { BookingView, BookingStatus } from "@/lib/types";

export function BookingDetail({
  booking,
  onBack,
  onSOS,
  onRate
}: {
  booking: BookingView;
  onBack: () => void;
  onSOS: () => void;
  onRate: () => void;
}) {
  const router = useRouter();
  const [working, setWorking] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

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

  const split = {
    worker: Math.round(booking.amount * 0.95),
    platform: booking.amount - Math.round(booking.amount * 0.95)
  };

  return (
    <div className="flex-1 overflow-y-auto bg-ink-50">
      <div className="px-4 pt-3 pb-2 bg-white flex items-center gap-2 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-ink-50 text-ink-700 flex items-center justify-center"
        >
          ‹
        </button>
        <div className="text-[13px] font-semibold text-ink-900">Booking detail</div>
      </div>

      <div className="p-4 space-y-3">
        <div className="rounded-2xl bg-white border border-ink-100 p-4 shadow-card">
          <div className="flex items-center justify-between">
            <Pill tone={pillFor(booking.status)}>{booking.status.replace("_", " ")}</Pill>
            <span className="text-[10px] text-ink-500">
              Booked {dateLine(booking.createdAt)} · {timeOnly(booking.createdAt)}
            </span>
          </div>
          <div className="mt-2 text-[16px] font-semibold text-ink-900">
            {booking.skill} · {booking.locality}
          </div>
          <div className="mt-3">
            <StatusStepper status={booking.status} />
          </div>
        </div>

        {/* Worker card */}
        <div className="rounded-2xl bg-white border border-ink-100 p-4 shadow-card">
          <div className="flex items-center gap-3">
            <Avatar name={booking.worker.name} hue={booking.worker.avatarHue} size={56} />
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-ink-900">
                {booking.worker.name}
              </div>
              <div className="text-[11px] text-ink-500">{booking.worker.cooperative}</div>
            </div>
            <a
              href={`tel:${booking.worker.phone}`}
              className="w-10 h-10 rounded-full bg-green-700 text-white text-lg flex items-center justify-center"
            >
              📞
            </a>
            <SOSButton onTrigger={onSOS} />
          </div>
        </div>

        {/* Payment breakdown */}
        <div className="rounded-2xl bg-white border border-ink-100 p-4 shadow-card">
          <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
            Payment
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-[12px] text-ink-700">You pay</div>
            <div className="text-[18px] font-bold text-ink-900">{inr(booking.amount)}</div>
          </div>
          <div className="mt-3">
            <SplitBar amount={booking.amount} />
          </div>
          <div className="mt-3 text-[10px] text-ink-500">
            {booking.inEscrow
              ? "Held in escrow by the federation. Released to the worker on completion."
              : "Released to the worker on completion."}
          </div>
        </div>

        {booking.notes ? (
          <div className="rounded-2xl bg-white border border-ink-100 p-4 shadow-card">
            <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
              Notes
            </div>
            <div className="mt-1 text-[12px] text-ink-700">{booking.notes}</div>
          </div>
        ) : null}

        {/* Action CTAs */}
        <div className="space-y-2">
          {booking.status === "IN_PROGRESS" ? (
            <button
              onClick={() => patch("complete")}
              disabled={working}
              className="w-full bg-green-700 hover:bg-green-600 text-white text-[14px] font-semibold rounded-full py-3 disabled:opacity-60"
            >
              {working ? "Marking…" : "Mark completed"}
            </button>
          ) : null}
          {booking.status === "COMPLETED" ? (
            <button
              onClick={onRate}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white text-[14px] font-semibold rounded-full py-3"
            >
              ★ Rate this booking
            </button>
          ) : null}
          {booking.status === "BOOKED" || booking.status === "ACCEPTED" ? (
            <button
              onClick={() => setShowCancel(true)}
              className="w-full bg-white border border-ink-100 text-ink-700 text-[13px] font-semibold rounded-full py-3"
            >
              Cancel booking
            </button>
          ) : null}
        </div>
      </div>

      <Modal
        open={showCancel}
        onClose={() => setShowCancel(false)}
        title="Cancel booking?"
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => setShowCancel(false)}
              className="flex-1 bg-white border border-ink-100 text-ink-700 text-[13px] font-semibold rounded-full py-2.5"
            >
              Keep booking
            </button>
            <button
              onClick={async () => {
                await fetch(`/api/bookings/${booking.id}`, {
                  method: "PATCH",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ action: "complete" })
                });
                setShowCancel(false);
                router.refresh();
              }}
              className="flex-1 bg-danger-500 text-white text-[13px] font-semibold rounded-full py-2.5"
            >
              Yes, cancel
            </button>
          </div>
        }
      >
        <div className="text-[12px] text-ink-700 leading-snug">
          Cancelling before the worker accepts does not affect their earnings.
          After the worker has started, your primary cooperative may follow up
          to confirm the reason.
        </div>
      </Modal>
    </div>
  );
}

function pillFor(s: BookingStatus): "green" | "orange" | "warn" | "muted" | "danger" {
  if (s === "BOOKED") return "muted";
  if (s === "ACCEPTED") return "warn";
  if (s === "IN_PROGRESS") return "orange";
  if (s === "COMPLETED") return "green";
  return "danger";
}
