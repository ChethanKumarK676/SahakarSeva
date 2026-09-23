import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { splitEarnings } from "@/lib/fairWageFloors";

export const dynamic = "force-dynamic";

/* State machine for a booking. We keep this tight and explicit so the
 * surface area of what can happen is small and auditable.
 */
const ALLOWED: Record<string, string[]> = {
  BOOKED: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: []
};

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const body = (await req.json()) as { action: string };
  const booking = await prisma.booking.findUnique({ where: { id: ctx.params.id } });
  if (!booking) return NextResponse.json({ error: "not found" }, { status: 404 });

  const now = new Date();
  let next = booking.status;
  let patch: Record<string, unknown> = {};

  switch (body.action) {
    case "accept":
      if (!ALLOWED[booking.status].includes("ACCEPTED"))
        return NextResponse.json({ error: "bad transition" }, { status: 409 });
      next = "ACCEPTED";
      patch = { acceptedAt: now };
      break;
    case "start":
      if (!ALLOWED[booking.status].includes("IN_PROGRESS"))
        return NextResponse.json({ error: "bad transition" }, { status: 409 });
      next = "IN_PROGRESS";
      patch = { startedAt: now, lastCheckInAt: now };
      break;
    case "complete":
      if (!ALLOWED[booking.status].includes("COMPLETED"))
        return NextResponse.json({ error: "bad transition" }, { status: 409 });
      next = "COMPLETED";
      patch = { completedAt: now, inEscrow: false };
      // Release escrow → create a paid-out earning
      const split = splitEarnings(booking.amount);
      await prisma.earning.create({
        data: {
          workerId: booking.workerId,
          amount: split.worker,
          gross: booking.amount,
          status: "PAID_OUT",
          bookingId: booking.id
        }
      });
      break;
    case "checkin":
      patch = { lastCheckInAt: now };
      break;
    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: next, ...patch }
  });
  return NextResponse.json({ booking: updated });
}
