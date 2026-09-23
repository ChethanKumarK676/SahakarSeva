/* PhoneFrame
 * Renders a single 390x844 phone surface on a desktop background. The app
 * lives inside the phone; the page never scrolls. This matches the
 * prototype's "real phone frame" look (notch, status bar).
 */
import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-ink-50 via-ink-100 to-ink-200 flex items-center justify-center py-6 px-4">
      <div className="w-[390px] h-[844px] bg-ink-50 rounded-[44px] shadow-phone p-[10px] relative overflow-hidden">
        <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[110px] h-[26px] bg-ink-900 rounded-full z-30" />
        <div className="w-full h-full bg-ink-50 rounded-[34px] overflow-hidden relative">
          {/* Status bar */}
          <div className="h-[42px] px-6 flex items-center justify-between text-[12px] font-semibold text-ink-900 relative z-20">
            <span>9:41</span>
            <span className="text-[10px] tracking-wide">●●● 5G ▮</span>
          </div>
          <div className="h-[calc(100%-42px)] overflow-hidden flex flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
}
