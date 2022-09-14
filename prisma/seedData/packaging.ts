import { Prisma } from "@prisma/client";

export const packagingData: Prisma.PackagingCreateManyInput[] = [
  {
    packagingCode: "TANK",
    name: "Tank",
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    packagingCode: "DRUM",
    name: "Drum",
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    packagingCode: "BULK",
    name: "Bulk",
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
];
