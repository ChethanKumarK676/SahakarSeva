// Singleton Prisma client. In dev, Next.js hot-reloads modules and would
// otherwise create one client per reload, exhausting SQLite's connection
// budget. The globalThis cache makes it stable across reloads.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
