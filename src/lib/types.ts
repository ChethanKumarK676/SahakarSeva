/* Shared view-model types. We re-shape the Prisma row into a flatter form
 * the UI can render without scattering `.customer.name` chains through
 * every component. Keeping the shape here means the API and the UI speak
 * the same vocabulary.
 */

export type BookingStatus = "BOOKED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type WorkerCard = {
  id: string;
  name: string;
  skill: string;
  locality: string;
  rating: number;
  jobsDone: number;
  standardRate: number;
  cooperative: string;
  avatarHue: number;
  phone: string;
  bio: string;
};

export type BookingView = {
  id: string;
  status: BookingStatus;
  skill: string;
  locality: string;
  amount: number;
  offer: number;
  etaMinutes: number;
  notes: string | null;
  createdAt: string;
  acceptedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  lastCheckInAt: string | null;
  inEscrow: boolean;
  worker: { id: string; name: string; phone: string; avatarHue: number; cooperative: string };
  customer: { id: string; name: string; phone: string; avatarHue: number };
};

export type RequestView = {
  id: string;
  skill: string;
  locality: string;
  budget: number;
  window: string;
  notes: string | null;
  status: string;
  createdAt: string;
  customer: { name: string; avatarHue: number; locality: string };
};

export type EarningView = {
  id: string;
  amount: number;
  gross: number;
  status: "IN_ESCROW" | "PAID_OUT";
  createdAt: string;
};

export type SessionView = {
  role: "customer" | "worker";
  customerId: string;
  workerId: string;
};
