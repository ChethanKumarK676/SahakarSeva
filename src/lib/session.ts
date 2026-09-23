/* Lightweight "who am I" session.
 *
 * For the SIH demo we don't need real auth. A single signed-ish cookie
 * identifies which side of the marketplace the user is on (customer or
 * worker) and which specific record to load. Switching the role from
 * the app bar mutates this cookie; pages re-read it on every render.
 *
 * Default values: customer = Priya, worker = Sita — same as the prototype.
 */
import { cookies } from "next/headers";

export type Role = "customer" | "worker";

export const SESSION_COOKIE = "ss_session";
export const DEFAULT_CUSTOMER_ID = "cust-priya";
export const DEFAULT_WORKER_ID = "wrk-sita";

export type Session = {
  role: Role;
  customerId: string;
  workerId: string;
};

export function readSession(): Session {
  const jar = cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (raw) {
    try {
      const parsed = JSON.parse(decodeURIComponent(raw));
      if (parsed && (parsed.role === "customer" || parsed.role === "worker")) {
        return {
          role: parsed.role,
          customerId: parsed.customerId || DEFAULT_CUSTOMER_ID,
          workerId: parsed.workerId || DEFAULT_WORKER_ID
        };
      }
    } catch {
      // fall through
    }
  }
  return {
    role: "customer",
    customerId: DEFAULT_CUSTOMER_ID,
    workerId: DEFAULT_WORKER_ID
  };
}

export function encodeSession(s: Session): string {
  return encodeURIComponent(JSON.stringify(s));
}
