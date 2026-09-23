import { prisma } from "@/lib/db";
import { readSession } from "@/lib/session";
import { AppShell } from "@/components/AppShell";

/* Single-page app.
 *
 * The whole demo lives at "/". State is encoded in the URL hash for
 * deep-linkability (e.g. #book:bk-001), but the data itself comes from
 * Prisma so it survives reloads. Server-render the seed data once;
 * AppShell takes over for the interactive parts.
 */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const s = readSession();
  const [customer, worker] = await Promise.all([
    prisma.customer.findUnique({ where: { id: s.customerId } }),
    prisma.worker.findUnique({ where: { id: s.workerId } })
  ]);

  if (!customer || !worker) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-ink-700">
        <div className="bg-white rounded-2xl p-6 shadow-card max-w-sm">
          <div className="text-[16px] font-semibold text-ink-900">No seed data</div>
          <div className="text-[12px] text-ink-700 mt-2">
            Run <code className="bg-ink-50 px-1 rounded">npx prisma db seed</code> in
            the <code className="bg-ink-50 px-1 rounded">build/</code> folder to
            populate the demo database, then refresh this page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      session={{ role: s.role, customerId: s.customerId, workerId: s.workerId }}
      customer={{
        name: customer.name,
        phone: customer.phone,
        avatarHue: customer.avatarHue,
        addresses: customer.addresses
      }}
      worker={{
        id: worker.id,
        name: worker.name,
        phone: worker.phone,
        avatarHue: worker.avatarHue,
        skill: worker.skill,
        locality: worker.locality,
        rating: worker.rating,
        jobsDone: worker.jobsDone,
        standardRate: worker.standardRate,
        cooperative: worker.cooperative,
        bio: worker.bio,
        spotlightPoints: worker.spotlightPoints,
        spotlightBoosts: worker.spotlightBoosts,
        aadhaarOk: worker.aadhaarOk,
        digilockerOk: worker.digilockerOk,
        policeOk: worker.policeOk,
        coopSignoffOk: worker.coopSignoffOk,
        esicOk: worker.esicOk,
        pmjayOk: worker.pmjayOk,
        pensionOk: worker.pensionOk,
        emergencyOk: worker.emergencyOk,
        availabilityFrom: worker.availabilityFrom,
        availabilityTo: worker.availabilityTo,
        serviceRadiusKm: worker.serviceRadiusKm,
        voiceLanguage: worker.voiceLanguage
      }}
    />
  );
}
