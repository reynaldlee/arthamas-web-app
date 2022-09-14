import { Prisma } from "@prisma/client";

export const servicesData: Prisma.ServiceCreateManyInput[] = [
  {
    serviceCode: "100001",
    name: "Shipping & Handling",
    currencyCode: "USD",
    unitPrice: 15,
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
];
