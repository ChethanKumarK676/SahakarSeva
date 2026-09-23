"use client";

/* AppShell — the brain of the single-page demo.
 *
 * Owns:
 *   - The role (customer / worker) — from the server-rendered session
 *   - The active tab — bottom-bar
 *   - The current view — which screen to show on top of the tab
 *   - The modal stack — book sheet, post-job sheet, SOS sheet, rate sheet
 *
 * Why a client component:
 *   - Every interaction is local state (no server roundtrip needed to
 *     switch tabs or open a sheet — keeps the demo snappy)
 *   - The server-rendered page.tsx hands us the seed data once, and we
 *     refetch on the rare cases we actually need fresh data.
 *
 * Why not React Router or Next routing:
 *   - Judges will tap-tap-tap during the demo. Every navigation is
 *     instant. Only the four mutations (book, post-job, accept, etc.)
 *     hit the API.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/PhoneFrame";
import { AppBar } from "@/components/AppBar";
import { BottomTabs, type Tab } from "@/components/BottomTabs";

import { CustomerHome } from "@/components/customer/CustomerHome";
import { CustomerBrowse } from "@/components/customer/CustomerBrowse";
import { CustomerBookings } from "@/components/customer/CustomerBookings";
import { CustomerProfile } from "@/components/customer/CustomerProfile";
import { WorkerDetail } from "@/components/customer/WorkerDetail";
import { BookSheet } from "@/components/customer/BookSheet";
import { PostJobSheet } from "@/components/customer/PostJobSheet";
import { SOSSheet } from "@/components/customer/SOSSheet";
import { RateSheet } from "@/components/customer/RateSheet";
import { BookingDetail } from "@/components/customer/BookingDetail";

import { WorkerToday } from "@/components/worker/WorkerToday";
import { WorkerJobs } from "@/components/worker/WorkerJobs";
import { WorkerEarnings } from "@/components/worker/WorkerEarnings";
import { WorkerProfile } from "@/components/worker/WorkerProfile";
import { ActiveJobCard } from "@/components/worker/ActiveJobCard";

import type { WorkerCard } from "@/lib/types";

const CUSTOMER_TABS: Tab[] = [
  { key: "home", label: "Home", icon: "🏠" },
  { key: "browse", label: "Browse", icon: "🔎" },
  { key: "bookings", label: "Bookings", icon: "📋" },
  { key: "profile", label: "Profile", icon: "👤" }
];

const WORKER_TABS: Tab[] = [
  { key: "today", label: "Today", icon: "☀" },
  { key: "jobs", label: "Jobs", icon: "📋" },
  { key: "earnings", label: "Earnings", icon: "₹" },
  { key: "profile", label: "Profile", icon: "👤" }
];

type View =
  | { kind: "home" }
  | { kind: "browse" }
  | { kind: "bookings" }
  | { kind: "profile" }
  | { kind: "worker"; id: string }
  | { kind: "booking"; id: string };

export function AppShell({
  session,
  customer,
  worker
}: {
  session: { role: "customer" | "worker"; customerId: string; workerId: string };
  customer: {
    name: string;
    phone: string;
    avatarHue: number;
    addresses: string;
  };
  worker: {
    id: string;
    name: string;
    phone: string;
    avatarHue: number;
    skill: string;
    locality: string;
    rating: number;
    jobsDone: number;
    standardRate: number;
    cooperative: string;
    bio: string;
    spotlightPoints: number;
    spotlightBoosts: number;
    aadhaarOk: boolean;
    digilockerOk: boolean;
    policeOk: boolean;
    coopSignoffOk: boolean;
    esicOk: boolean;
    pmjayOk: boolean;
    pensionOk: boolean;
    emergencyOk: boolean;
    availabilityFrom: string;
    availabilityTo: string;
    serviceRadiusKm: number;
    voiceLanguage: string;
  };
}) {
  const router = useRouter();
  const [tab, setTab] = useState<string>("home");
  const [view, setView] = useState<View>({ kind: "home" });
  const [bookTarget, setBookTarget] = useState<WorkerCard | null>(null);
  const [postJobOpen, setPostJobOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [rateFor, setRateFor] = useState<string | null>(null);

  // When role changes (e.g. user toggled the app-bar switch), reset
  // to the home tab. Next's router.refresh() in AppBar re-runs page.tsx
  // and the new server data flows down — but our local UI state is
  // already correct.
  useEffect(() => {
    setTab(session.role === "customer" ? "home" : "today");
    setView({ kind: session.role === "customer" ? "home" : "home" });
  }, [session.role]);

  // Deep-link support: #worker:wrk-ramesh, #booking:bk-001
  useEffect(() => {
    const apply = () => {
      const h = window.location.hash.replace(/^#/, "");
      if (!h) return;
      const [k, id] = h.split(":");
      if (k === "worker" && id) {
        setView({ kind: "worker", id });
        setTab("browse");
      } else if (k === "booking" && id) {
        setView({ kind: "booking", id });
        setTab(session.role === "customer" ? "bookings" : "today");
      } else if (k === "rate" && id) {
        setRateFor(id);
      } else if (k === "post") {
        setPostJobOpen(true);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [session.role]);

  function navigateTo(v: View) {
    setView(v);
    if (v.kind === "home") setTab(session.role === "customer" ? "home" : "today");
    if (v.kind === "browse") setTab("browse");
    if (v.kind === "bookings") setTab("bookings");
    if (v.kind === "profile") setTab("profile");
    if (v.kind === "booking") {
      // Don't change tab — user came from somewhere and is in a detail view
    }
  }

  // ---------- View pickers -----------------------------------------------
  function renderCustomerBody() {
    if (view.kind === "browse") return <CustomerBrowse onWorker={(id) => navigateTo({ kind: "worker", id })} />;
    if (view.kind === "bookings") {
      return (
        <CustomerBookings
          onOpen={(id) => navigateTo({ kind: "booking", id })}
        />
      );
    }
    if (view.kind === "profile") return <CustomerProfile customer={customer} />;
    if (view.kind === "worker" && view.id) {
      return (
        <WorkerDetail
          workerId={view.id}
          onBack={() => navigateTo({ kind: "browse" })}
          onBook={(w) => {
            setBookTarget(w);
          }}
        />
      );
    }
    if (view.kind === "booking" && view.id) {
      return <BookingDetailFromId id={view.id} onBack={() => navigateTo({ kind: "bookings" })} onSOS={() => setSosOpen(true)} onRate={(id) => setRateFor(id)} />;
    }
    return (
      <CustomerHome
        customerName={customer.name}
        onBrowse={() => navigateTo({ kind: "browse" })}
        onPostJob={() => setPostJobOpen(true)}
        onWorker={(id) => navigateTo({ kind: "worker", id })}
        onBooking={(id) => navigateTo({ kind: "booking", id })}
      />
    );
  }

  function renderWorkerBody() {
    if (view.kind === "browse") return <WorkerJobs onOpen={(id) => navigateTo({ kind: "booking", id })} />;
    if (view.kind === "bookings") return <WorkerJobs onOpen={(id) => navigateTo({ kind: "booking", id })} />;
    if (view.kind === "profile") {
      return (
        <WorkerProfile
          worker={worker}
        />
      );
    }
    if (view.kind === "booking" && view.id) {
      return <ActiveJobFromId id={view.id} onBack={() => navigateTo({ kind: "home" })} onSOS={() => setSosOpen(true)} />;
    }
    return (
      <WorkerToday
        workerName={worker.name}
        cooperative={worker.cooperative}
        rating={worker.rating}
        onBooking={(id) => navigateTo({ kind: "booking", id })}
      />
    );
  }

  const tabs = session.role === "customer" ? CUSTOMER_TABS : WORKER_TABS;

  return (
    <PhoneFrame>
      <AppBar
        role={session.role}
        name={session.role === "customer" ? customer.name : worker.name}
        subtitle={session.role === "customer" ? undefined : worker.cooperative}
      />
      <div className="flex-1 flex flex-col min-h-0">
        {session.role === "customer" ? renderCustomerBody() : renderWorkerBody()}
      </div>
      <BottomTabs
        tabs={tabs}
        active={tab}
        onChange={(k) => {
          setTab(k);
          if (k === "home") setView({ kind: "home" });
          if (k === "today") setView({ kind: "home" });
          if (k === "browse") setView({ kind: "browse" });
          if (k === "bookings") setView({ kind: "bookings" });
          if (k === "earnings") setView({ kind: "home" });
          if (k === "profile") setView({ kind: "profile" });
          if (k === "jobs") setView({ kind: "browse" });
        }}
      />

      <BookSheet open={!!bookTarget} onClose={() => setBookTarget(null)} worker={bookTarget} />
      <PostJobSheet open={postJobOpen} onClose={() => setPostJobOpen(false)} />
      <SOSSheet open={sosOpen} onClose={() => setSosOpen(false)} />
      <RateSheet open={!!rateFor} onClose={() => setRateFor(null)} bookingId={rateFor} />
    </PhoneFrame>
  );
}

/* Small wrappers that fetch a single booking by id and pass it down.
 * Kept inline because they're only used here and need access to the
 * router.refresh() pattern after mutations.
 */
function BookingDetailFromId({
  id,
  onBack,
  onSOS,
  onRate
}: {
  id: string;
  onBack: () => void;
  onSOS: () => void;
  onRate: (id: string) => void;
}) {
  const [booking, setBooking] = useState<any | null>(null);
  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => {
        const b = (d.bookings as any[]).find((x) => x.id === id);
        setBooking(b ?? null);
      });
  }, [id]);
  if (!booking) {
    return <div className="flex-1 flex items-center justify-center text-ink-500 text-[12px]">Loading…</div>;
  }
  return <BookingDetail booking={booking} onBack={onBack} onSOS={onSOS} onRate={() => onRate(id)} />;
}

function ActiveJobFromId({
  id,
  onBack,
  onSOS
}: {
  id: string;
  onBack: () => void;
  onSOS: () => void;
}) {
  const [booking, setBooking] = useState<any | null>(null);
  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => {
        const b = (d.bookings as any[]).find((x) => x.id === id);
        setBooking(b ?? null);
      });
  }, [id]);
  if (!booking) {
    return <div className="flex-1 flex items-center justify-center text-ink-500 text-[12px]">Loading…</div>;
  }
  return <ActiveJobCard booking={booking} onBack={onBack} onSOS={onSOS} />;
}
