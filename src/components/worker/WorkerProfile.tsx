"use client";

/* WorkerProfile
 * Spotlight Points card (with a "Use boost" CTA that spends a boost),
 * Verification rows, Welfare rows, Settings.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { boostsAvailable, MONTHLY_BOOST_CAP, nextResetLabel } from "@/lib/spotlight";

export function WorkerProfile({
  worker
}: {
  worker: {
    id: string;
    name: string;
    avatarHue: number;
    cooperative: string;
    spotlightPoints: number;
    spotlightBoosts: number;
    aadhaarOk: boolean;
    digilockerOk: boolean;
    policeOk: boolean;
    coopSignoffOk: boolean;
    esicOk: boolean;
    pmjayOk: boolean;
    pensionOk: boolean;
    emergencyOk: boolean;
    availabilityFrom: string;
    availabilityTo: string;
    serviceRadiusKm: number;
    voiceLanguage: string;
  };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const boosts = boostsAvailable(worker.spotlightPoints);

  async function useBoost() {
    if (boosts <= 0) return;
    setBusy(true);
    await fetch("/api/spotlight", { method: "POST" });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex-1 overflow-y-auto bg-ink-50">
      <div className="px-5 pt-5 pb-4 bg-white">
        <div className="flex items-center gap-3">
          <Avatar name={worker.name} hue={worker.avatarHue} size={64} />
          <div className="flex-1">
            <div className="text-[16px] font-semibold text-ink-900">{worker.name}</div>
            <div className="text-[11px] text-ink-500">{worker.cooperative}</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Spotlight */}
        <div className="rounded-2xl bg-gradient-to-br from-green-700 to-green-900 text-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
              Spotlight Points
            </div>
            <Pill tone="orange">{nextResetLabel()}</Pill>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-[28px] font-bold leading-none">{worker.spotlightPoints}</div>
            <div className="text-[11px] opacity-80">points · {boosts} boosts available</div>
          </div>
          <div className="mt-1 text-[10px] opacity-80 leading-snug">
            Earned by referring a new worker who registers and verifies.
            Boosts lift you in customer search results — never your rating.
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={useBoost}
              disabled={busy || boosts <= 0}
              className="bg-orange-500 hover:bg-orange-400 text-white text-[12px] font-semibold rounded-full px-3 py-1.5 disabled:opacity-50"
            >
              {busy ? "Using…" : "Use a boost"}
            </button>
            <span className="text-[10px] opacity-80">
              {worker.spotlightBoosts}/{MONTHLY_BOOST_CAP} used this month
            </span>
          </div>
        </div>

        {/* Verification */}
        <Section title="Verification">
          <Row ok={worker.aadhaarOk} label="Aadhaar" hint="UIDAI verified" />
          <Row ok={worker.digilockerOk} label="DigiLocker · PMKVY" hint="Skill India linked" />
          <Row ok={worker.policeOk} label="Police verification" hint="Local station check" />
          <Row ok={worker.coopSignoffOk} label="Cooperative sign-off" hint={worker.cooperative} />
        </Section>

        {/* Welfare */}
        <Section title="Welfare">
          <Row ok={worker.esicOk} label="ESIC" hint="Medical insurance, active" />
          <Row ok={worker.pmjayOk} label="PM-JAY" hint="₹5L cover, active" />
          <Row ok={worker.pensionOk} label="Cooperative pension" hint="In progress" />
          <Row ok={worker.emergencyOk} label="Emergency fund" hint="Enrolled" />
        </Section>

        {/* Settings */}
        <Section title="Settings">
          <SettingRow
            icon="🕒"
            label="Availability hours"
            value={`${worker.availabilityFrom} – ${worker.availabilityTo}`}
          />
          <SettingRow icon="📍" label="Service radius" value={`${worker.serviceRadiusKm} km`} />
          <SettingRow icon="🎙" label="Voice language" value={worker.voiceLanguage} />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-ink-500 uppercase tracking-wider mb-1.5 px-1">
        {title}
      </div>
      <div className="rounded-2xl bg-white border border-ink-100 shadow-card divide-y divide-ink-100 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function Row({ ok, label, hint }: { ok: boolean; label: string; hint: string }) {
  return (
    <div className="px-3 py-3 flex items-center gap-3">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
          ok ? "bg-green-100 text-green-700" : "bg-ink-100 text-ink-500"
        }`}
      >
        {ok ? "✓" : "—"}
      </div>
      <div className="flex-1">
        <div className="text-[12px] font-semibold text-ink-900">{label}</div>
        <div className="text-[10px] text-ink-500">{hint}</div>
      </div>
      {ok ? <Pill tone="green">Active</Pill> : <Pill tone="muted">Pending</Pill>}
    </div>
  );
}

function SettingRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="px-3 py-3 flex items-center gap-3">
      <span className="w-7 h-7 rounded-full bg-ink-50 flex items-center justify-center text-sm">
        {icon}
      </span>
      <span className="flex-1 text-[12px] text-ink-900">{label}</span>
      <span className="text-[11px] text-ink-500">{value}</span>
      <span className="text-ink-300">›</span>
    </div>
  );
}
