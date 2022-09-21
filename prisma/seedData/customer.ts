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
  {
    customerCode: "MERATUSGROUP",
    name: "MERATUS GROUP",
    address: "Jl. Aloon - aloon Priok No. 27 Perak Barat, Krembangan Surabaya",
    top: 90,
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
];
