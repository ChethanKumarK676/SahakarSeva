/* SahakarSeva seed
 *
 * Mirrors the HTML prototype's fixture set so the working model looks the
 * same on first launch as the prototype did. Priya M. is the customer,
 * Sita Devi is the worker. 7 workers, 3 bookings, 1 open request,
 * 5 earnings. All numbers are INR per visit.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Wipe everything (idempotent re-seed)
  await prisma.spotlightEvent.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.earning.deleteMany();
  await prisma.openRequest.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.customer.deleteMany();

  // ----- People -----------------------------------------------------------
  const priya = await prisma.customer.create({
    data: {
      id: "cust-priya",
      name: "Priya M.",
      phone: "+91 98•••••012",
      email: "priya@example.in",
      avatarHue: 200,
      addresses: JSON.stringify([
        { label: "Home", line: "12, 5th Main, Indiranagar", city: "Bengaluru" },
        { label: "Office", line: "WeWork Galaxy, Residency Rd", city: "Bengaluru" }
      ])
    }
  });

  const sita = await prisma.worker.create({
    data: {
      id: "wrk-sita",
      name: "Sita Devi",
      phone: "+91 90•••••221",
      avatarHue: 140,
      skill: "Domestic Help",
      locality: "Indiranagar",
      rating: 4.9,
      jobsDone: 142,
      standardRate: 220,
      cooperative: "Karnataka Domestic Workers Cooperative Federation",
      cooperativeId: "FED-KA-DWC-001",
      bio: "Cooking, cleaning, utensil-care. 8 years in Indiranagar households.",
      spotlightPoints: 12,
      spotlightBoosts: 0,
      voiceLanguage: "Kannada"
    }
  });

  const workers = await Promise.all([
    sita,
    prisma.worker.create({
      data: {
        id: "wrk-ramesh",
        name: "Ramesh Kumar",
        phone: "+91 90•••••308",
        avatarHue: 30,
        skill: "Electrician",
        locality: "Indiranagar",
        rating: 4.8,
        jobsDone: 211,
        standardRate: 250,
        cooperative: "Bengaluru Electricians & Wiring Co-op",
        cooperativeId: "PRI-KA-ELC-014",
        bio: "House wiring, fan/light install, MCB trips, inverter hook-up."
      }
    }),
    prisma.worker.create({
      data: {
        id: "wrk-anil",
        name: "Anil Patil",
        phone: "+91 90•••••411",
        avatarHue: 10,
        skill: "Plumber",
        locality: "Koramangala",
        rating: 4.7,
        jobsDone: 168,
        standardRate: 280,
        cooperative: "Koramangala Sanitary & Plumbing Sahakari",
        cooperativeId: "PRI-KA-PLB-007",
        bio: "Leak repair, tap replacement, geyser install, blocked drains."
      }
    }),
    prisma.worker.create({
      data: {
        id: "wrk-lakshmi",
        name: "Lakshmi K.",
        phone: "+91 90•••••520",
        avatarHue: 320,
        skill: "Carpenter",
        locality: "Indiranagar",
        rating: 4.9,
        jobsDone: 96,
        standardRate: 320,
        cooperative: "Bengaluru Woodworkers Sahakari",
        cooperativeId: "PRI-KA-CRP-022",
        bio: "Modular kitchen, door repair, polish, custom shelves."
      }
    }),
    prisma.worker.create({
      data: {
        id: "wrk-vijay",
        name: "Vijay Singh",
        phone: "+91 90•••••633",
        avatarHue: 200,
        skill: "Painter",
        locality: "HSR Layout",
        rating: 4.6,
        jobsDone: 73,
        standardRate: 450,
        cooperative: "HSR Painters & Decorators Co-op",
        cooperativeId: "PRI-KA-PNT-019",
        bio: "Interior painting, distemper, texture, waterproofing."
      }
    }),
    prisma.worker.create({
      data: {
        id: "wrk-raju",
        name: "Raju B.",
        phone: "+91 90•••••744",
        avatarHue: 60,
        skill: "Driver",
        locality: "Indiranagar",
        rating: 4.7,
        jobsDone: 188,
        standardRate: 300,
        cooperative: "Bengaluru Drivers Sahakari",
        cooperativeId: "PRI-KA-DRV-031",
        bio: "Outstation trips, airport drops, school pickup. Owns Etios."
      }
    }),
    prisma.worker.create({
      data: {
        id: "wrk-kavita",
        name: "Kavita R.",
        phone: "+91 90•••••855",
        avatarHue: 280,
        skill: "Gardener",
        locality: "Koramangala",
        rating: 4.8,
        jobsDone: 64,
        standardRate: 220,
        cooperative: "Koramangala Terrace Gardeners Co-op",
        cooperativeId: "PRI-KA-GRD-005",
        bio: "Balcony gardens, pest care, organic composting."
      }
    }),
    prisma.worker.create({
      data: {
        id: "wrk-meera",
        name: "Meera S.",
        phone: "+91 90•••••966",
        avatarHue: 0,
        skill: "Cleaner",
        locality: "Indiranagar",
        rating: 4.9,
        jobsDone: 122,
        standardRate: 180,
        cooperative: "Bengaluru Deep-Cleaning Sahakari",
        cooperativeId: "PRI-KA-CLN-012",
        bio: "Deep clean, sofa shampoo, kitchen degrease."
      }
    })
  ]);

  // ----- Bookings ---------------------------------------------------------
  await prisma.booking.create({
    data: {
      id: "bk-001",
      customerId: priya.id,
      workerId: sita.id,
      skill: "Domestic Help",
      locality: "Indiranagar",
      amount: 240,
      offer: 240,
      status: "IN_PROGRESS",
      etaMinutes: 12,
      startedAt: new Date(Date.now() - 30 * 60 * 1000),
      lastCheckInAt: new Date(Date.now() - 7 * 60 * 1000),
      notes: "Weekly cleaning, 9–11am"
    }
  });

  await prisma.booking.create({
    data: {
      id: "bk-002",
      customerId: priya.id,
      workerId: workers[1].id, // Ramesh
      skill: "Electrician",
      locality: "Indiranagar",
      amount: 280,
      offer: 280,
      status: "COMPLETED",
      acceptedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000)
    }
  });

  await prisma.booking.create({
    data: {
      id: "bk-003",
      customerId: priya.id,
      workerId: workers[6].id, // Meera
      skill: "Cleaner",
      locality: "Indiranagar",
      amount: 200,
      offer: 200,
      status: "COMPLETED",
      acceptedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
    }
  });

  // ----- Open request -----------------------------------------------------
  await prisma.openRequest.create({
    data: {
      id: "req-001",
      customerId: priya.id,
      workerId: sita.id,
      skill: "Domestic Help",
      locality: "Indiranagar",
      budget: 220,
      window: "Sat 22 Sep · 10:00–12:00",
      notes: "Weekend deep clean + laundry fold",
      status: "PENDING",
      createdAt: new Date(Date.now() - 6 * 60 * 1000)
    }
  });

  // ----- Earnings (Sita's history) ---------------------------------------
  const earnings = [
    { delta: 228, gross: 240, status: "IN_ESCROW" }, // live job
    { delta: 380, gross: 400, status: "PAID_OUT" },
    { delta: 285, gross: 300, status: "PAID_OUT" },
    { delta: 304, gross: 320, status: "PAID_OUT" },
    { delta: 247, gross: 260, status: "PAID_OUT" }
  ];

  for (let i = 0; i < earnings.length; i++) {
    const e = earnings[i];
    await prisma.earning.create({
      data: {
        workerId: sita.id,
        amount: e.delta,
        gross: e.gross,
        status: e.status,
        createdAt: new Date(Date.now() - (i + 1) * 18 * 60 * 60 * 1000)
      }
    });
  }

  // ----- Spotlight event log ---------------------------------------------
  await prisma.spotlightEvent.create({
    data: {
      workerId: sita.id,
      delta: 4,
      reason: "REFERRAL"
    }
  });
  await prisma.spotlightEvent.create({
    data: {
      workerId: sita.id,
      delta: 4,
      reason: "REFERRAL"
    }
  });
  await prisma.spotlightEvent.create({
    data: {
      workerId: sita.id,
      delta: 4,
      reason: "REFERRAL"
    }
  });

  console.log(
    `Seeded: 1 customer, ${workers.length} workers, 3 bookings, 1 open request, ${earnings.length} earnings, 3 spotlight events.`
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
