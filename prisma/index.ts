import { PrismaClient } from "@prisma/client";
import Prisma from "@prisma/client";

//@ts-ignore
Prisma.Decimal.prototype.toJSON = function () {
  return this.toNumber();
};

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  prismaGlobal.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.prisma = prisma;
}
