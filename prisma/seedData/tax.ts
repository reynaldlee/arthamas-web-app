import { Prisma } from "@prisma/client";

export const taxData: Prisma.TaxCreateManyInput[] = [
  {
    taxCode: "PPN11",
    name: "PPN 11%",
    taxRate: 0.11,
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
];
