import { Prisma } from "@prisma/client";

export const truckData: Prisma.TruckCreateManyInput[] = [
  {
    truckCode: "B001",
    name: "Mitsubishi Elf",
    policeNumber: "B 1090 ABC",
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    truckCode: "B002",
    name: "Mitsubishi Elf",
    policeNumber: "L 100 BA",
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
];
