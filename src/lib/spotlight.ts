/* Spotlight Points economy.
 *
 * Spotlight Points are an in-app currency that boost a worker's visibility
 * in customer search results. They are *earned*, never bought. The
 * prototype surfaced "12 points = 3 boosts this month"; we encode that
 * here as 4 points per boost, monthly reset. The full set of earn / spend
 * rules is small enough to live in one file.
 *
 * IMPORTANT: per the spec, a Spotlight boost is a *visibility* boost only.
 * It never overrides the rating-based ranking — a low-rated worker still
 * cannot outrank a well-reviewed one. The search-results component is
 * responsible for applying this rule.
 */

export const POINTS_PER_BOOST = 4;
export const MONTHLY_BOOST_CAP = 3; // soft cap surfaced in the UI

export type SpotlightReason = "REFERRAL" | "BOOST_USED" | "MILESTONE" | "ADJUST";

export function boostsAvailable(points: number): number {
  return Math.floor(points / POINTS_PER_BOOST);
}

export function nextResetLabel(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const days = Math.ceil((next.getTime() - now.getTime()) / 86400000);
  return `resets in ${days} day${days === 1 ? "" : "s"}`;
}

export function describeReason(reason: SpotlightReason): string {
  switch (reason) {
    case "REFERRAL":
      return "Referred a new worker";
    case "BOOST_USED":
      return "Used a search-result boost";
    case "MILESTONE":
      return "Reached a job milestone";
    case "ADJUST":
      return "Manual adjustment";
  }
}
