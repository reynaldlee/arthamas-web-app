import { Prisma } from "@prisma/client";

export const portData: Prisma.PortCreateManyInput[] = [
  {
    portCode: "TNJPRK",
    name: "Tanjung Priok",
    area: "Jakarta",
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    portCode: "MRK",
    name: "Pelabuhan Merak",
    area: "Jakarta",
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
];
