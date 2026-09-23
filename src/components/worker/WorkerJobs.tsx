"use client";

/* WorkerJobs
 * Active + completed-this-week list. Same row visual as CustomerBookings
 * but for the worker perspective.
 */
import { useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { inr, ago } from "@/lib/formatters";
import type { BookingView } from "@/lib/types";

export function WorkerJobs({ onOpen }: { onOpen: (id: string) => void }) {
  const [bookings, setBookings] = useState<BookingView[]>([]);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings));
  }, []);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const active = bookings.filter(
    (b) => b.status === "BOOKED" || b.status === "ACCEPTED" || b.status === "IN_PROGRESS"
  );
  const completed = bookings.filter(
    (b) => b.status === "COMPLETED" && new Date(b.completedAt ?? b.createdAt) >= weekAgo
  );

  return (
    <div className="flex-1 overflow-y-auto bg-ink-50">
      <div className="px-5 pt-4 pb-2">
        <div className="text-[18px] font-semibold text-ink-900">Your jobs</div>
        <div className="text-[11px] text-ink-500 mt-0.5">
          Active and the last 7 days of completed work.
        </div>
      </div>

      <Section title={`Active (${active.length})`}>
        {active.length === 0 ? (
          <div className="px-5 py-6 text-center text-ink-500 text-[12px]">
            No active jobs. New requests appear in Today.
          </div>
        ) : (
          active.map((b) => <Row key={b.id} booking={b} onOpen={onOpen} />)
        )}
      </Section>

      <Section title={`Completed this week (${completed.length})`}>
        {completed.length === 0 ? (
          <div className="px-5 py-6 text-center text-ink-500 text-[12px]">
            No completed jobs in the last 7 days.
          </div>
        ) : (
          completed.map((b) => <Row key={b.id} booking={b} onOpen={onOpen} />)
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 pb-3">
      <div className="text-[10px] font-semibold text-ink-500 uppercase tracking-wider mb-1.5 px-1">
        {title}
      </div>
      <div className="rounded-2xl bg-white border border-ink-100 shadow-card divide-y divide-ink-100 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function Row({ booking, onOpen }: { booking: BookingView; onOpen: (id: string) => void }) {
  return (
    <button
      onClick={() => onOpen(booking.id)}
      className="w-full text-left px-3 py-3 flex items-center gap-3 active:bg-ink-50 transition"
    >
      <Avatar name={booking.customer.name} hue={booking.customer.avatarHue} />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-ink-900 truncate">
          {booking.skill} · {booking.locality}
        </div>
        <div className="text-[11px] text-ink-500 truncate">
          {booking.customer.name} · {ago(booking.createdAt)}
        </div>
      </div>
      <div className="text-right">
        <Pill tone={pillFor(booking.status)}>{booking.status.replace("_", " ")}</Pill>
        <div className="mt-1 text-[11px] text-green-700 font-semibold">
          {inr(Math.round(booking.amount * 0.95))}
        </div>
      </div>
    </button>
  );
}

function pillFor(s: string): "green" | "orange" | "warn" | "muted" | "danger" {
  if (s === "BOOKED") return "muted";
  if (s === "ACCEPTED") return "warn";
  if (s === "IN_PROGRESS") return "orange";
  if (s === "COMPLETED") return "green";
  return "danger";
}
