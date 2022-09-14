import { Prisma } from "@prisma/client";

export const customerData: Prisma.CustomerCreateManyInput[] = [
  {
    customerCode: "INDOBARUNA",
    name: "INDOBARUNA BULK TRANSPORT, PT.",
    address: "",
    top: 90,
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
];
