"use client";

/* PostJobSheet
 * The customer posts an open job (no specific worker). Service picker,
 * locality dropdown, budget input with the same floor check, time window,
 * notes. Posting creates an OpenRequest row.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/Modal";
import { inr } from "@/lib/formatters";
import { TRADES, getFloor } from "@/lib/fairWageFloors";
import { useEffect } from "react";

const WINDOWS = [
  "Today · afternoon",
  "Today · evening",
  "Tomorrow morning",
  "Tomorrow afternoon",
  "Sat 22 Sep · 10:00–12:00",
  "Within a week"
];

export function PostJobSheet({
  open,
  onClose,
  defaultLocality = "Indiranagar"
}: {
  open: boolean;
  onClose: () => void;
  defaultLocality?: string;
}) {
  const router = useRouter();
  const [skill, setSkill] = useState<string>("Domestic Help");
  const [locality, setLocality] = useState<string>(defaultLocality);
  const [budget, setBudget] = useState<number>(220);
  const [window, setWindow] = useState<string>(WINDOWS[0]);
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSkill("Domestic Help");
      setLocality(defaultLocality);
      setBudget(getFloor("Domestic Help", defaultLocality));
      setWindow(WINDOWS[0]);
      setNotes("");
    }
  }, [open, defaultLocality]);

  const floor = getFloor(skill, locality);
  const below = budget < floor;

  async function submit() {
    if (below) return;
    setSubmitting(true);
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ skill, locality, budget, window, notes })
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
      title="Post a job"
      footer={
        <button
          onClick={submit}
          disabled={below || submitting}
          className={`w-full rounded-full py-3 text-[14px] font-semibold transition ${
            below || submitting
              ? "bg-ink-100 text-ink-500 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-400"
          }`}
        >
          {submitting ? "Posting…" : `Post job · ${inr(budget)}`}
        </button>
      }
    >
      <div className="space-y-4">
        <div>
          <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
            Service
          </div>
          <div className="grid grid-cols-4 gap-2">
            {TRADES.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setSkill(t);
                  setBudget(getFloor(t, locality));
                }}
                className={`text-[10px] rounded-xl py-2 px-1 border ${
                  skill === t
                    ? "bg-green-900 text-white border-green-900"
                    : "bg-white text-ink-700 border-ink-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
            Locality
          </div>
          <select
            value={locality}
            onChange={(e) => {
              setLocality(e.target.value);
              setBudget(getFloor(skill, e.target.value));
            }}
            className="w-full text-[12px] rounded-2xl border border-ink-100 bg-white px-3 py-2.5"
          >
            <option>Indiranagar</option>
            <option>Koramangala</option>
            <option>HSR Layout</option>
            <option>Whitefield</option>
            <option>Jayanagar</option>
          </select>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
            Budget (₹)
          </div>
          <input
            type="number"
            value={budget || ""}
            onChange={(e) => setBudget(Number(e.target.value) || 0)}
            className="w-full text-[20px] font-bold text-ink-900 rounded-2xl border-2 border-ink-100 focus:border-orange-500 outline-none px-4 py-3"
            min={0}
          />
          <div className="mt-1 text-[11px]">
            {below ? (
              <span className="text-danger-500 font-semibold">
                ⚠ Below the {inr(floor)} fair-wage floor.
              </span>
            ) : (
              <span className="text-green-700">
                ✓ At or above the {inr(floor)} fair-wage floor.
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
            When
          </div>
          <select
            value={window}
            onChange={(e) => setWindow(e.target.value)}
            className="w-full text-[12px] rounded-2xl border border-ink-100 bg-white px-3 py-2.5"
          >
            {WINDOWS.map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
            Notes (optional)
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Anything specific the worker should know?"
            className="w-full text-[12px] rounded-2xl border border-ink-100 bg-white px-3 py-2.5"
          />
        </div>
      </div>
    </Modal>
  );
}
