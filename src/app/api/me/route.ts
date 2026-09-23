import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/session";

export const dynamic = "force-dynamic";

/* Single endpoint the app shell hits to learn who it's rendering for and
 * to load the most recent state. Used by the initial server render. */
export async function GET(_req: NextRequest) {
  const s = readSession();
  const [customer, worker] = await Promise.all([
    prisma.customer.findUnique({ where: { id: s.customerId } }),
    prisma.worker.findUnique({ where: { id: s.workerId } })
  ]);
  return NextResponse.json({ session: s, customer, worker });
}
