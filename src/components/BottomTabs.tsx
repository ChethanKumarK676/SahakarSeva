"use client";

/* BottomTabs
 * The 4-tab bottom bar shared by both sides of the app. Customer tabs:
 * Home, Browse, Bookings, Profile. Worker tabs: Today, Jobs, Earnings,
 * Profile. The active tab is highlighted with the orange accent.
 */
import { useRouter } from "next/navigation";

export type TabKey = string;

export type Tab = {
  key: TabKey;
  label: string;
  icon: string; // emoji or single-glyph
};

export function BottomTabs({
  tabs,
  active,
  onChange
}: {
  tabs: Tab[];
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  return (
    <nav className="border-t border-ink-100 bg-white px-2 pt-2 pb-3 grid grid-cols-4 text-[10px] font-medium">
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`flex flex-col items-center gap-0.5 py-1 ${
              isActive ? "text-orange-500" : "text-ink-500"
            }`}
          >
            <span className="text-lg leading-none">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
