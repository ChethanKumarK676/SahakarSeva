import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { bookingId: string; stars: number; comment?: string };
  if (!body.bookingId || !body.stars) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const rating = await prisma.rating.upsert({
    where: { bookingId: body.bookingId },
    update: { stars: body.stars, comment: body.comment ?? null },
    create: {
      bookingId: body.bookingId,
      stars: body.stars,
      comment: body.comment ?? null
    }
  });
  return NextResponse.json({ rating });
}
