import { Prisma } from "@prisma/client";

export const vesselData: Prisma.VesselCreateManyInput[] = [
  {
    vesselCode: "PERKASA",
    name: "Perkasa",
    customerCode: "INDOBARUNA",
    regNo: "123456788",
    orgCode: "ASM",
    imoNumber: "12323425345",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    vesselCode: "MANDRAGUNA",
    name: "MANDRAGUNA",
    customerCode: "INDOBARUNA",
    regNo: "123456787",
    orgCode: "ASM",
    imoNumber: "1232342535",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    vesselCode: "OCEAN JOY",
    name: "OCEANIC JOY",
    customerCode: "INDOBARUNA",
    regNo: "123456789",
    orgCode: "ASM",
    imoNumber: "12323425345",
    createdBy: "system",
    updatedBy: "system",
  },
];

export const vesselProductData: Prisma.VesselProductCreateManyInput[] = [
  {
    vesselCode: "MANDRAGUNA",
    productCode: "AMD3005",
    orgCode: "ASM",
  },
  {
    vesselCode: "MANDRAGUNA",
    productCode: "ATI3030",
    orgCode: "ASM",
  },
  {
    vesselCode: "PERKASA",
    productCode: "AMD3005",
    orgCode: "ASM",
  },
  {
    vesselCode: "PERKASA",
    productCode: "ATI3030",
    orgCode: "ASM",
  },
];
