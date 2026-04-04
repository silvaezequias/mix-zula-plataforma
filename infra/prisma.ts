import { PrismaClient } from "@prisma/client";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: IS_PRODUCTION ? ["query"] : [],
  });

if (!IS_PRODUCTION) {
  globalForPrisma.prisma = prisma;
}
