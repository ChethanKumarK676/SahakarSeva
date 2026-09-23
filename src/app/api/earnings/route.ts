import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const s = readSession();
  const earnings = await prisma.earning.findMany({
    where: { workerId: s.workerId },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ earnings });
}
