"use client";

/* CustomerBrowse
 * Search across workers by name, skill, locality, cooperative. Filter
 * pills by trade, locality dropdown. Active filter chips removable.
 * "Open pricing" banner at the top.
 */
import { useEffect, useMemo, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { inr } from "@/lib/formatters";
import { TRADES } from "@/lib/fairWageFloors";
import type { WorkerCard } from "@/lib/types";

export function CustomerBrowse({ onWorker }: { onWorker: (id: string) => void }) {
  const [workers, setWorkers] = useState<WorkerCard[]>([]);
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState<string>("All");
  const [locality, setLocality] = useState<string>("All");

  useEffect(() => {
    fetch("/api/workers")
      .then((r) => r.json())
      .then((d) => setWorkers(d.workers));
  }, []);

  const localities = useMemo(
    () => Array.from(new Set(workers.map((w) => w.locality))).sort(),
    [workers]
  );

  const filtered = workers.filter((w) => {
    if (skill !== "All" && w.skill !== skill) return false;
    if (locality !== "All" && w.locality !== locality) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      if (
        !w.name.toLowerCase().includes(q) &&
        !w.skill.toLowerCase().includes(q) &&
        !w.locality.toLowerCase().includes(q) &&
        !w.cooperative.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-ink-50">
      {/* Open pricing banner */}
      <div className="m-4 rounded-2xl bg-green-700 text-white p-3 flex items-center gap-2 shadow-card">
        <span className="text-lg">🤝</span>
        <div className="text-[11px] leading-snug">
          <span className="font-semibold">Open pricing:</span> workers can also
          accept jobs you post. No algorithmic ranking, no surge.
        </div>
      </div>

      {/* Search */}
      <div className="px-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, skill, locality, cooperative"
            className="w-full rounded-full bg-white border border-ink-100 pl-9 pr-3 py-2.5 text-[12px] text-ink-700 placeholder-ink-500"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 text-sm">🔍</span>
        </div>
      </div>

      {/* Skill pills */}
      <div className="px-4 mt-3 flex gap-2 overflow-x-auto pb-1">
        {["All", ...TRADES].map((s) => (
          <button
            key={s}
            onClick={() => setSkill(s)}
            className={`shrink-0 text-[11px] font-semibold rounded-full px-3 py-1.5 border ${
              skill === s
                ? "bg-green-900 text-white border-green-900"
                : "bg-white text-ink-700 border-ink-100"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Locality filter */}
      <div className="px-4 mt-2 flex items-center gap-2">
        <span className="text-[10px] font-semibold text-ink-500">Locality</span>
        <select
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          className="text-[11px] rounded-full border border-ink-100 bg-white px-3 py-1 text-ink-700"
        >
          <option value="All">All</option>
          {localities.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        {skill !== "All" || locality !== "All" || query ? (
          <button
            onClick={() => {
              setSkill("All");
              setLocality("All");
              setQuery("");
            }}
            className="ml-auto text-[10px] text-orange-500 font-semibold"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {/* Active chips */}
      <div className="px-4 mt-2 flex flex-wrap gap-1.5">
        {skill !== "All" ? (
          <Chip label={skill} onClear={() => setSkill("All")} />
        ) : null}
        {locality !== "All" ? (
          <Chip label={locality} onClear={() => setLocality("All")} />
        ) : null}
        {query.trim() ? (
          <Chip label={`"${query}"`} onClear={() => setQuery("")} />
        ) : null}
      </div>

      {/* List */}
      <div className="px-4 mt-3 space-y-2 pb-3">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-ink-500 text-[12px]">
            No workers match — try clearing a filter.
          </div>
        ) : (
          filtered.map((w) => (
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
                  {w.skill} · {w.locality} · ⭐ {w.rating.toFixed(1)} · {w.jobsDone} jobs
                </div>
                <div className="text-[10px] text-ink-500 truncate">{w.cooperative}</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-semibold text-ink-900">
                  {inr(w.standardRate)}
                </div>
                <div className="text-[9px] text-ink-500">per visit</div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full pl-2.5 pr-1 py-0.5">
      {label}
      <button onClick={onClear} className="w-4 h-4 rounded-full hover:bg-green-200 flex items-center justify-center">
        ✕
      </button>
    </span>
  );
}
