/* Fair-wage floor table — single source of truth
 *
 * The fair-wage floor is the *minimum* pay a worker can be offered for a
 * given trade in a given locality, set by the primary cooperative society
 * (not the platform). It is the single most important business rule in
 * SahakarSeva: a customer cannot bid below it, the "Confirm" button disables
 * itself when the offer drops below it, and the same number is shown on
 * the worker detail page and the post-a-job sheet.
 *
 * Values here are an *MVP starting set* — in production they would be
 * per-(society, locality, trade) and versioned. The prototype hard-coded
 * a flat per-trade number; we keep that as the default and let locality
 * nudge a multiplier for high-cost zones.
 */

export type Trade =
  | "Electrician"
  | "Plumber"
  | "Carpenter"
  | "Painter"
  | "Domestic Help"
  | "Driver"
  | "Gardener"
  | "Cleaner";

export const TRADES: Trade[] = [
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Domestic Help",
  "Driver",
  "Gardener",
  "Cleaner"
];

// Base floor, in INR per visit, by trade. Localised defaults for Bengaluru
// (Tier-1 cost-of-living baseline). These match the prototype's hard-coded
// values exactly so the two builds look the same on day one.
export const BASE_FLOOR: Record<Trade, number> = {
  Electrician: 180,
  Plumber: 200,
  Carpenter: 220,
  Painter: 250,
  "Domestic Help": 120,
  Driver: 150,
  Gardener: 130,
  Cleaner: 110
};

// Locality multiplier — Tier-1 metro core (Indiranagar, Koramangala, HSR)
// gets a small premium so the same worker is paid a bit more for the same
// job in a more expensive catchment. The platform does not keep the
// difference — it is paid by the customer to the worker.
const TIER1_CORE = new Set(["Indiranagar", "Koramangala", "HSR Layout"]);

export function getFloor(trade: string, locality?: string | null): number {
  const t = trade as Trade;
  const base = BASE_FLOOR[t] ?? 150;
  if (locality && TIER1_CORE.has(locality)) {
    return Math.round(base * 1.1);
  }
  return base;
}

export function splitEarnings(amount: number) {
  // 95% worker / 5% platform. Floor enforcement is a *separate* check
  // done by the caller; this just splits an already-valid amount.
  const worker = Math.round(amount * 0.95);
  const platform = amount - worker;
  return { worker, platform };
}

export function isValidTrade(s: string): s is Trade {
  return TRADES.includes(s as Trade);
}
