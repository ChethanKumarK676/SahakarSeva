/* SplitBar
 * The 95 / 5 split visualisation. Renders a horizontal stacked bar with
 * the worker's share (green) and the platform's share (orange). Used on
 * the worker detail page, the booking detail page, and the book sheet
 * (where it updates live as the customer types the offer).
 */
import { inr } from "@/lib/formatters";
import { splitEarnings } from "@/lib/fairWageFloors";

export function SplitBar({
  amount,
  showLabels = true,
  height = 12
}: {
  amount: number;
  showLabels?: boolean;
  height?: number;
}) {
  const { worker, platform } = splitEarnings(amount);
  const workerPct = amount > 0 ? (worker / amount) * 100 : 95;
  return (
    <div className="w-full">
      <div
        className="w-full overflow-hidden rounded-full bg-ink-100 flex"
        style={{ height }}
      >
        <div
          className="bg-green-700 transition-[width] duration-200"
          style={{ width: `${workerPct}%` }}
        />
        <div
          className="bg-orange-500 transition-[width] duration-200"
          style={{ width: `${100 - workerPct}%` }}
        />
      </div>
      {showLabels ? (
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-green-700" />
            <span className="font-semibold text-ink-900">Worker {inr(worker)}</span>
            <span className="text-ink-500">· 95%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-orange-500" />
            <span className="font-semibold text-ink-900">Platform {inr(platform)}</span>
            <span className="text-ink-500">· 5%</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
