import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  encodeSession,
  type Role
} from "@/lib/session";

export const dynamic = "force-dynamic";

/* Switch the active role. We don't redirect — the page re-renders based on
 * the new cookie value.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as { role: Role; customerId?: string; workerId?: string };
  const jar = cookies();
  const existing = jar.get(SESSION_COOKIE)?.value;
  let prev = { customerId: "cust-priya", workerId: "wrk-sita" };
  if (existing) {
    try {
      prev = { ...prev, ...JSON.parse(decodeURIComponent(existing)) };
    } catch {
      /* ignore */
    }
  }
  const next = {
    role: body.role,
    customerId: body.customerId ?? prev.customerId,
    workerId: body.workerId ?? prev.workerId
  };
  jar.set(SESSION_COOKIE, encodeSession(next), {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30
  });
  return NextResponse.json({ session: next });
}
