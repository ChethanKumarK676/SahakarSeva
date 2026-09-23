import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/session";
import { POINTS_PER_BOOST } from "@/lib/spotlight";

export const dynamic = "force-dynamic";

/* Spend a Spotlight boost. Atomically: deduct points, increment used count,
 * and append a SpotlightEvent row. Returns the updated worker.
 */
export async function POST(req: NextRequest) {
  const s = readSession();
  const worker = await prisma.worker.findUnique({ where: { id: s.workerId } });
  if (!worker) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (worker.spotlightPoints < POINTS_PER_BOOST) {
    return NextResponse.json({ error: "not enough points" }, { status: 402 });
  }
  const updated = await prisma.worker.update({
    where: { id: worker.id },
    data: {
      spotlightPoints: { decrement: POINTS_PER_BOOST },
      spotlightBoosts: { increment: 1 }
    }
  });
  await prisma.spotlightEvent.create({
    data: { workerId: worker.id, delta: -POINTS_PER_BOOST, reason: "BOOST_USED" }
  });
  return NextResponse.json({ worker: updated });
}
