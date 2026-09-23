"use client";

/* CustomerBookings
 * The customer's booking list. Tap a row → booking detail with the 4-step
 * status stepper, payment breakdown, SOS, Call, Mark completed, Rate.
 */
import { useEffect, useState } from "react";
import { Pill } from "@/components/Pill";
import { inr, ago, dateLine } from "@/lib/formatters";
import type { BookingView } from "@/lib/types";

export function CustomerBookings({ onOpen }: { onOpen: (id: string) => void }) {
  const [bookings, setBookings] = useState<BookingView[]>([]);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings));
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-ink-50">
      <div className="px-5 pt-4 pb-2">
        <div className="text-[18px] font-semibold text-ink-900">Your bookings</div>
        <div className="text-[11px] text-ink-500 mt-0.5">
          Payments held in escrow until you confirm completion.
        </div>
      </div>
      <div className="px-4 pb-4 space-y-2">
        {bookings.length === 0 ? (
          <div className="text-center py-12 text-ink-500 text-[12px]">
            No bookings yet — head to Browse to find a worker.
          </div>
        ) : (
          bookings.map((b) => (
            <button
              key={b.id}
              onClick={() => onOpen(b.id)}
              className="w-full text-left rounded-2xl bg-white border border-ink-100 p-3 shadow-card active:scale-[0.99] transition"
            >
              <div className="flex items-center justify-between">
                <Pill tone={pillFor(b.status)}>{b.status.replace("_", " ")}</Pill>
                <span className="text-[10px] text-ink-500">{ago(b.createdAt)}</span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-ink-900 truncate">
                    {b.skill} · {b.locality}
                  </div>
                  <div className="text-[11px] text-ink-500 truncate">
                    with {b.worker.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-semibold text-ink-900">
                    {inr(b.amount)}
                  </div>
                  <div className="text-[9px] text-ink-500">you paid</div>
                </div>
              </div>
              <div className="mt-1 text-[10px] text-ink-500">
                Worker earns {inr(Math.round(b.amount * 0.95))} ·{" "}
                <span className="text-green-700 font-semibold">95%</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function pillFor(s: string): "green" | "orange" | "warn" | "muted" | "danger" {
  if (s === "BOOKED") return "muted";
  if (s === "ACCEPTED") return "warn";
  if (s === "IN_PROGRESS") return "orange";
  if (s === "COMPLETED") return "green";
  return "danger";
}
