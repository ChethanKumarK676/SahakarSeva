import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { splitEarnings } from "@/lib/fairWageFloors";
import { readSession, SESSION_COOKIE, DEFAULT_WORKER_ID } from "@/lib/session";
import type { BookingStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const s = readSession();
  const where = s.role === "customer" ? { customerId: s.customerId } : { workerId: s.workerId };

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      worker: { select: { id: true, name: true, phone: true, avatarHue: true, cooperative: true } },
      customer: { select: { id: true, name: true, phone: true, avatarHue: true } },
      rating: true
    }
  });
  // Reshape into BookingView — explicit cast via JSON so Date becomes string
  const views = bookings.map((b) => ({
    id: b.id,
    status: b.status as BookingStatus,
    skill: b.skill,
    locality: b.locality,
    amount: b.amount,
    offer: b.offer,
    etaMinutes: b.etaMinutes,
    notes: b.notes,
    createdAt: b.createdAt.toISOString(),
    acceptedAt: b.acceptedAt?.toISOString() ?? null,
    startedAt: b.startedAt?.toISOString() ?? null,
    completedAt: b.completedAt?.toISOString() ?? null,
    lastCheckInAt: b.lastCheckInAt?.toISOString() ?? null,
    inEscrow: b.inEscrow,
    worker: b.worker,
    customer: b.customer,
    rating: b.rating
  }));
  return NextResponse.json({ bookings: views });
}

export async function POST(req: NextRequest) {
  const s = readSession();
  const body = (await req.json()) as {
    workerId: string;
    skill: string;
    locality: string;
    amount: number;
    offer: number;
    notes?: string;
  };
  if (!body.workerId || !body.skill || !body.locality || !body.amount) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const booking = await prisma.booking.create({
    data: {
      customerId: s.customerId,
      workerId: body.workerId,
      skill: body.skill,
      locality: body.locality,
      amount: body.amount,
      offer: body.offer,
      notes: body.notes ?? null,
      status: "BOOKED"
    }
  });
  return NextResponse.json({ booking });
}
