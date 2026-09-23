/* StatusStepper
 * The 4-step booking status indicator. Booked → Accepted → In progress →
 * Completed. Cancelled is rendered as a red "Cancelled" pill instead of a
 * step.
 */
import type { BookingStatus } from "@/lib/types";

const STEPS: { key: BookingStatus; label: string }[] = [
  { key: "BOOKED", label: "Booked" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "IN_PROGRESS", label: "In progress" },
  { key: "COMPLETED", label: "Completed" }
];

export function StatusStepper({ status }: { status: BookingStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="bg-danger-500/10 text-danger-500 text-[12px] font-semibold rounded-full px-3 py-1 inline-flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-danger-500" /> Cancelled
      </div>
    );
  }
  const activeIndex = STEPS.findIndex((s) => s.key === status);
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-1">
        {STEPS.map((s, i) => {
          const done = i < activeIndex;
          const current = i === activeIndex;
          return (
            <div key={s.key} className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  done
                    ? "bg-green-700 text-white"
                    : current
                    ? "bg-orange-500 text-white"
                    : "bg-ink-100 text-ink-500"
                }`}
              >
                {done ? "✓" : i + 1}
              </div>
              <div
                className={`mt-1 text-[10px] font-medium ${
                  current ? "text-orange-500" : done ? "text-green-700" : "text-ink-500"
                }`}
              >
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1 grid grid-cols-4 gap-1">
        {[0, 1, 2].map((i) => {
          const reached = i < activeIndex;
          return (
            <div key={i} className="h-[2px] -mx-0.5">
              <div className={`h-full ${reached ? "bg-green-700" : "bg-ink-100"}`} />
            </div>
          );
        })}
        <div className="h-[2px]" />
      </div>
    </div>
  );
}
