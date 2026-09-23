import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/session";

export const dynamic = "force-dynamic";

/* Accept or decline a request addressed to the current worker. On accept,
 * a Booking is created in BOOKED state — the open job effectively becomes
 * a confirmed booking. The decline path simply marks the request DECLINED
 * and leaves the door open for another worker to pick it up.
 */
export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  const s = readSession();
  const body = (await req.json()) as { action: "accept" | "decline" };
  const request = await prisma.openRequest.findUnique({ where: { id: ctx.params.id } });
  if (!request) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (request.status !== "PENDING")
    return NextResponse.json({ error: "already responded" }, { status: 409 });

  if (body.action === "decline") {
    const updated = await prisma.openRequest.update({
      where: { id: request.id },
      data: { status: "DECLINED", respondedAt: new Date(), workerId: s.workerId }
    });
    return NextResponse.json({ request: updated });
  }

  // accept — create booking, then update request
  const booking = await prisma.booking.create({
    data: {
      customerId: request.customerId,
      workerId: s.workerId,
      skill: request.skill,
      locality: request.locality,
      amount: request.budget,
      offer: request.budget,
      notes: request.notes,
      status: "ACCEPTED",
      acceptedAt: new Date()
    }
  });
  const updated = await prisma.openRequest.update({
    where: { id: request.id },
    data: { status: "ACCEPTED", respondedAt: new Date(), workerId: s.workerId }
  });
  return NextResponse.json({ request: updated, booking });
}
