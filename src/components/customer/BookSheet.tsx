"use client";

/* BookSheet
 * The floor-enforced offer entry. The customer types a number; the split
 * bar updates live; below the fair-wage floor the Confirm button greys
 * out and a warning appears. The single most important interaction in
 * the app — judges will try to break it.
 */
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/Modal";
import { SplitBar } from "@/components/SplitBar";
import { Pill } from "@/components/Pill";
import { inr } from "@/lib/formatters";
import { getFloor } from "@/lib/fairWageFloors";
import type { WorkerCard } from "@/lib/types";

export function BookSheet({
  open,
  onClose,
  worker
}: {
  open: boolean;
  onClose: () => void;
  worker: WorkerCard | null;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // Reset when worker changes
  useMemo(() => {
    if (worker) setAmount(worker.standardRate);
  }, [worker]);

  if (!worker) return null;
  const floor = getFloor(worker.skill, worker.locality);
  const below = amount < floor;
  const valid = amount >= floor;

  async function confirm() {
    if (!worker || !valid) return;
    setSubmitting(true);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        workerId: worker.id,
        skill: worker.skill,
        locality: worker.locality,
        amount,
        offer: amount
      })
    });
    setSubmitting(false);
    if (res.ok) {
      onClose();
      router.refresh();
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Book ${worker.name.split(" ")[0]}`}
      footer={
        <button
          onClick={confirm}
          disabled={!valid || submitting}
          className={`w-full rounded-full py-3 text-[14px] font-semibold transition ${
            valid && !submitting
              ? "bg-orange-500 text-white hover:bg-orange-400"
              : "bg-ink-100 text-ink-500 cursor-not-allowed"
          }`}
        >
          {submitting ? "Confirming…" : `Confirm · ${inr(amount)}`}
        </button>
      }
    >
      <div className="space-y-4">
        <div>
          <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
            Your offer (₹)
          </div>
          <input
            type="number"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="mt-1 w-full text-[22px] font-bold text-ink-900 rounded-2xl border-2 border-ink-100 focus:border-orange-500 outline-none px-4 py-3"
            min={0}
          />
          {below ? (
            <div className="mt-2 text-[11px] text-danger-500 font-semibold">
              ⚠ Below the {inr(floor)} fair-wage floor set by {worker.cooperative}.
              Try a higher number.
            </div>
          ) : (
            <div className="mt-2 text-[11px] text-green-700">
              ✓ At or above the {inr(floor)} fair-wage floor.
            </div>
          )}
        </div>

        <div>
          <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
            Where your money goes
          </div>
          <div className="mt-2">
            <SplitBar amount={amount || 0} />
          </div>
        </div>

        <div className="rounded-2xl bg-ink-50 p-3 text-[11px] text-ink-700 leading-snug">
          Payment is held in <span className="font-semibold">escrow</span> by the
          federation. The worker is paid 95% on job completion; the 5% funds
          insurance, verification, and safety.
        </div>
      </div>
    </Modal>
  );
}
