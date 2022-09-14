import { Prisma } from "@prisma/client";

export const currencyData: Prisma.CurrencyCreateManyInput[] = [
  {
    currencyCode: "USD",
    name: "USD",
    rateIdr: 15000,
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    currencyCode: "IDR",
    name: "IDR",
    rateIdr: 1,
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
];
