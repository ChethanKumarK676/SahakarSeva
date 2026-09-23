import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const s = readSession();
  // Workers see requests addressed to them (or unassigned for their skill)
  // Customers see their own outbound requests.
  const where =
    s.role === "customer"
      ? { customerId: s.customerId }
      : {
          OR: [{ workerId: s.workerId }, { workerId: null, status: "PENDING" }]
        };
  const requests = await prisma.openRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, avatarHue: true, addresses: true } },
      worker: { select: { id: true, name: true, skill: true, locality: true } }
    }
  });
  return NextResponse.json({ requests });
}

export async function POST(req: NextRequest) {
  const s = readSession();
  const body = (await req.json()) as {
    skill: string;
    locality: string;
    budget: number;
    window: string;
    notes?: string;
    workerId?: string;
  };
  const created = await prisma.openRequest.create({
    data: {
      customerId: s.customerId,
      workerId: body.workerId ?? null,
      skill: body.skill,
      locality: body.locality,
      budget: body.budget,
      window: body.window,
      notes: body.notes ?? null,
      status: "PENDING"
    }
  });
  return NextResponse.json({ request: created });
}
