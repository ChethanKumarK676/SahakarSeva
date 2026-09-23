"use client";

/* CustomerProfile
 * The customer's profile page. Avatar, verified pill, addresses, payment
 * methods, language, notifications, annual impact, Help Center, 24×7
 * cooperative helpline, About.
 */
import { Avatar } from "@/components/Avatar";
import { Pill } from "@/components/Pill";
import { inr } from "@/lib/formatters";

export function CustomerProfile({
  customer
}: {
  customer: { name: string; phone: string; avatarHue: number; addresses: string };
}) {
  const addresses = JSON.parse(customer.addresses) as { label: string; line: string; city: string }[];
  return (
    <div className="flex-1 overflow-y-auto bg-ink-50">
      {/* Header card */}
      <div className="px-5 pt-5 pb-4 bg-white">
        <div className="flex items-center gap-3">
          <Avatar name={customer.name} hue={customer.avatarHue} size={64} />
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[16px] font-semibold text-ink-900">{customer.name}</span>
              <Pill tone="green">✓ Verified</Pill>
            </div>
            <div className="text-[11px] text-ink-500">{customer.phone}</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <Section title="Account">
          <Row icon="🏠" label="Addresses" value={`${addresses.length} saved`} />
          <Row icon="💳" label="Payment methods" value="UPI · Card · Cash" />
          <Row icon="🌐" label="Language" value="English" />
          <Row icon="🔔" label="Notifications" value="On" />
        </Section>

        <Section title="Your impact this year">
          <div className="rounded-2xl bg-green-50 border border-green-700/15 p-4">
            <div className="text-[11px] font-semibold text-green-700 uppercase tracking-wider">
              Cooperative contribution
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <div className="text-[24px] font-bold text-ink-900">₹1,960</div>
              <div className="text-[11px] text-ink-700">extra to workers vs. 25% aggregators</div>
            </div>
            <div className="mt-2 text-[11px] text-ink-700 leading-snug">
              Every booking on SahakarSeva pays the worker 95% of what you
              spend — that's the cooperative promise.
            </div>
          </div>
        </Section>

        <Section title="Support">
          <Row icon="❓" label="Help Center" value="FAQs" />
          <Row icon="☎" label="24×7 Cooperative Helpline" value="1800-419-2400" />
          <Row icon="🛡" label="Safety" value="On" />
        </Section>

        <Section title="About">
          <div className="px-4 py-3">
            <div className="text-[12px] text-ink-700 leading-snug">
              SahakarSeva is owned by the cooperatives, built for the workers.
              95% of every booking goes to the worker; the 5% that stays
              funds insurance, verification, and safety. Federation owns the
              code, society owns the worker.
            </div>
            <div className="mt-2 text-[10px] text-ink-500">
              v0.1 demo · data resets via "Reset demo" in Help Center
            </div>
          </div>
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
      <div className="rounded-2xl bg-white border border-ink-100 shadow-card divide-y divide-ink-100">
        {children}
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="w-7 h-7 rounded-full bg-ink-50 flex items-center justify-center text-sm">
        {icon}
      </span>
      <span className="flex-1 text-[12px] text-ink-900">{label}</span>
      <span className="text-[11px] text-ink-500">{value}</span>
      <span className="text-ink-300">›</span>
    </div>
  );
}
