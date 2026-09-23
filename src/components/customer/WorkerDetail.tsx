"use client";

/* WorkerDetail
 * The single worker page. Avatar, KPIs (rating, standard rate, jobs),
 * fair-wage-floor card with "set by [primary society]" line, the
 * 95/5 split bar, cooperative membership card, primary CTA. Tap CTA
 * → opens the BookSheet.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { SplitBar } from "@/components/SplitBar";
import { FairWageFloorCard } from "@/components/FairWageFloorCard";
import { inr } from "@/lib/formatters";
import { getFloor } from "@/lib/fairWageFloors";
import type { WorkerCard } from "@/lib/types";

export function WorkerDetail({
  workerId,
  onBook,
  onBack
}: {
  workerId: string;
  onBook: (worker: WorkerCard) => void;
  onBack: () => void;
}) {
  const router = useRouter();
  const [worker, setWorker] = useState<WorkerCard | null>(null);

  useEffect(() => {
    fetch("/api/workers")
      .then((r) => r.json())
      .then((d) => {
        const w = (d.workers as WorkerCard[]).find((x) => x.id === workerId);
        setWorker(w ?? null);
      });
  }, [workerId]);

  if (!worker) {
    return (
      <div className="flex-1 flex items-center justify-center text-ink-500 text-[12px]">
        Loading…
      </div>
    );
  }

  const floor = getFloor(worker.skill, worker.locality);

  return (
    <div className="flex-1 overflow-y-auto bg-ink-50">
      {/* Top bar */}
      <div className="px-4 pt-3 pb-2 bg-white flex items-center gap-2 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-ink-50 text-ink-700 flex items-center justify-center"
          aria-label="Back"
        >
          ‹
        </button>
        <div className="text-[13px] font-semibold text-ink-900">Worker profile</div>
      </div>

      <div className="p-4 space-y-3">
        {/* Hero */}
        <div className="rounded-2xl bg-white border border-ink-100 p-4 shadow-card">
          <div className="flex items-center gap-3">
            <Avatar name={worker.name} hue={worker.avatarHue} size={64} />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <div className="text-[15px] font-semibold text-ink-900">{worker.name}</div>
                <Pill tone="green">✓</Pill>
              </div>
              <div className="text-[11px] text-ink-500">
                {worker.skill} · {worker.locality}
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Stat label="Rating" value={`⭐ ${worker.rating.toFixed(1)}`} />
            <Stat label="Standard" value={inr(worker.standardRate)} />
            <Stat label="Jobs done" value={String(worker.jobsDone)} />
          </div>
        </div>

        <FairWageFloorCard floor={floor} society={worker.cooperative} />

        {/* 95/5 split */}
        <div className="rounded-2xl bg-white border border-ink-100 p-4 shadow-card">
          <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
            Where your money goes
          </div>
          <div className="mt-2 text-[12px] text-ink-700">
            On a {inr(worker.standardRate)} booking:
          </div>
          <div className="mt-2">
            <SplitBar amount={worker.standardRate} />
          </div>
        </div>

        {/* Bio */}
        <div className="rounded-2xl bg-white border border-ink-100 p-4 shadow-card">
          <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
            About
          </div>
          <div className="mt-2 text-[12px] text-ink-700 leading-snug">{worker.bio}</div>
        </div>

        {/* Cooperative membership */}
        <div className="rounded-2xl bg-green-50 border border-green-700/20 p-4">
          <div className="text-[11px] font-semibold text-green-700 uppercase tracking-wider">
            Cooperative member
          </div>
          <div className="mt-1 text-[13px] font-semibold text-ink-900">{worker.cooperative}</div>
          <div className="text-[11px] text-ink-700 mt-1 leading-snug">
            Member-owned. A share of the platform's 5% funds this society's
            welfare, insurance, and dispute-resolution work.
          </div>
        </div>

        <button
          onClick={() => onBook(worker)}
          className="w-full bg-orange-500 hover:bg-orange-400 text-white text-[14px] font-semibold rounded-full py-3 active:scale-[0.99] transition"
        >
          Book {worker.name.split(" ")[0]}
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-ink-50 py-2">
      <div className="text-[13px] font-semibold text-ink-900">{value}</div>
      <div className="text-[10px] text-ink-500">{label}</div>
    </div>
  );
}
