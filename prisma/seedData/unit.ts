import { Prisma } from "@prisma/client";

export const unitData: Prisma.UnitCreateManyInput[] = [
  {
    unitCode: "LTR",
    unitName: "Liter",
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    unitCode: "KG",
    unitName: "Kilogram",
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
];
