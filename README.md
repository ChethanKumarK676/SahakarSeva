# SahakarSeva

SahakarSeva is a Next.js demo application for a cooperative service marketplace that connects customers with verified workers. The app presents a mobile-first experience for two roles:

- Customer: browse workers, place bookings, create service requests, and rate completed jobs
- Worker: view assigned work, check earnings, manage availability, and track their profile

This project is structured as a prototype/demo app intended for presentation, user testing, and product storytelling.

## Tech stack

- Next.js 14
- React 18
- TypeScript
- Prisma ORM
- SQLite (for local demo database)
- Tailwind CSS

## Project purpose

The app models a cooperative gig/repair ecosystem where:

- a customer finds a trusted worker locally
- the worker is verified through cooperative and safety checks
- fair wage floors are enforced
- bookings and service requests are tracked in a streamlined dashboard
- transactions and worker earnings are represented in a simple escrow-style workflow

## Folder structure

```text
build/
├── .env                   # database config
├── next.config.mjs        # Next.js config
├── package.json           # scripts and dependencies
├── postcss.config.mjs     # Tailwind PostCSS config
├── prisma/
│   ├── schema.prisma      # SQLite data model
│   └── seed.ts            # demo seed script
├── src/
│   ├── app/
│   │   ├── api/            # REST endpoints for bookings, workers, requests, earnings, etc.
│   │   ├── globals.css     # app-wide styles
│   │   ├── layout.tsx      # root layout
│   │   └── page.tsx        # main app entry
│   ├── components/
│   │   ├── customer/       # customer screens and sheets
│   │   ├── worker/         # worker screens and cards
│   │   ├── AppBar.tsx
│   │   ├── AppShell.tsx    # core screen orchestration
│   │   ├── BottomTabs.tsx
│   │   ├── Modal.tsx
│   │   ├── PhoneFrame.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── db.ts           # Prisma client setup
│   │   ├── fairWageFloors.ts
│   │   ├── formatters.ts
│   │   ├── session.ts      # session role/customer/worker selection
│   │   ├── spotlight.ts
│   │   └── types.ts
│   └── ...
├── tsconfig.json
├── tailwind.config.ts
└── node_modules/
```

## Core app flow

The main app is driven by the server page in `src/app/page.tsx`.

- It reads the current session from `src/lib/session.ts`
- Loads a customer and worker from Prisma
- Passes the seed data to `AppShell`
- `AppShell` is the main stateful client component that handles
  - role switching
  - bottom-tab navigation
  - viewing worker and booking detail screens
  - modal sheets for booking, posting jobs, SOS, and rating

This structure keeps the demo fast and easy to present while still using real data from the database.

## Database model

The Prisma schema includes these key entities:

- `Customer`
- `Worker`
- `Booking`
- `OpenRequest`
- `Earning`
- `Rating`
- `SpotlightEvent`

The app stores core marketplace and verification data, including worker trust flags, service locality, cooperative identity, safety status, and payout records.

## Available scripts

From the `build/` directory:

```bash
npm install
npm run dev
```

Other useful commands:

```bash
npm run build
npm run start
npm run lint
npx prisma db push
npm run db:seed
npm run db:reset
```

## Setup instructions

1. Open a terminal in the `build` folder.
2. Install dependencies:

```bash
npm install
```

3. Ensure the database is initialized:

```bash
npx prisma db push
npm run db:seed
```

4. Run the app:

```bash
npm run dev
```

The app will typically run on:

```text
http://localhost:3000
```

## API routes

The app includes API endpoints under `src/app/api` for key actions such as:

- `/api/bookings`
- `/api/bookings/[id]`
- `/api/requests`
- `/api/requests/[id]/respond`
- `/api/workers`
- `/api/earnings`
- `/api/me`
- `/api/rate`
- `/api/role`
- `/api/spotlight`

These endpoints support the demo interactions and domain logic behind the user interface.

## Notes for contributors

- The app is built as a presentation prototype rather than a large-scale production backend.
- SQLite is intentionally lightweight and zero-config for easy local demo runs.
- Styling is built with Tailwind and mobile UI patterns to mimic a real app experience.
- Most user-facing flows are implemented as local client state transitions with small API calls for persistence and mutation.

## Summary

SahakarSeva is a polished demo app for a cooperative worker marketplace that emphasizes trust, local service discovery, fair wages, and worker welfare. It is designed for quick onboarding, presentation, and validation of the product concept.
