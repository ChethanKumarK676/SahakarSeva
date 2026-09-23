/* MapPlaceholder
 * A small inline SVG that looks like a map. Used on the booking detail
 * and active-job pages. Real PostGIS geo-search is out of scope for the
 * demo; this gives the same visual cue at one-tenth the build cost.
 */
export function MapPlaceholder({
  etaMinutes,
  height = 120
}: {
  etaMinutes?: number;
  height?: number;
}) {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-ink-100"
      style={{ height, background: "#e3ece7" }}
    >
      <svg
        viewBox="0 0 320 120"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cfd5d1" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="320" height="120" fill="url(#grid)" />
        <path d="M 10 90 Q 80 50 160 70 T 310 30" stroke="#a9b2ad" strokeWidth="3" fill="none" />
        <path d="M 0 100 L 320 100" stroke="#cfd5d1" strokeWidth="2" />
        <circle cx="40" cy="88" r="6" fill="#0a5d47" />
        <circle cx="290" cy="32" r="6" fill="#d85a30" />
        <text x="48" y="92" fontSize="9" fill="#0a5d47" fontWeight="600">
          You
        </text>
        <text x="248" y="28" fontSize="9" fill="#d85a30" fontWeight="600">
          Worker
        </text>
      </svg>
      {etaMinutes !== undefined ? (
        <div className="absolute right-3 top-3 bg-white rounded-full px-2.5 py-1 text-[11px] font-semibold text-ink-900 shadow-sm">
          ETA · {etaMinutes} min
        </div>
      ) : null}
    </div>
  );
}
