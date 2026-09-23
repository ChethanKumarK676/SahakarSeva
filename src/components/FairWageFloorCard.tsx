/* FairWageFloorCard
 * The "set by [primary cooperative]" callout. Renders the floor value
 * and which society set it, plus a one-line explanation of why the
 * floor exists.
 */
import { inr } from "@/lib/formatters";

export function FairWageFloorCard({
  floor,
  society
}: {
  floor: number;
  society: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-green-700/20 bg-green-50 p-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold text-green-700 uppercase tracking-wider">
          Fair-wage floor
        </div>
        <div className="text-[10px] text-ink-500">per visit</div>
      </div>
      <div className="mt-1 flex items-end gap-2">
        <div className="text-[26px] font-bold text-ink-900 leading-none">{inr(floor)}</div>
        <div className="text-[12px] text-ink-500 pb-1">minimum</div>
      </div>
      <div className="mt-2 text-[11px] text-ink-700 leading-snug">
        Set by <span className="font-semibold text-ink-900">{society}</span> — the
        worker's own primary cooperative society, not the platform. No bid below
        this is allowed.
      </div>
    </div>
  );
}
