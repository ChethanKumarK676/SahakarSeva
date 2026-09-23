import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const workers = await prisma.worker.findMany({
    orderBy: [{ rating: "desc" }, { jobsDone: "desc" }],
    select: {
      id: true,
      name: true,
      phone: true,
      avatarHue: true,
      skill: true,
      locality: true,
      rating: true,
      jobsDone: true,
      standardRate: true,
      cooperative: true,
      bio: true
    }
  });
  return NextResponse.json({ workers });
}
