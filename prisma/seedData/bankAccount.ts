import { Prisma } from "@prisma/client";

export const bankAccountData: Prisma.BankAccountCreateManyInput[] = [
  {
    bankAccountCode: "BCA01",
    bankAccountName: "PT Arthamas Sejahtera Mulia",
    bankAccountNumber: "123801823",
    bankName: "BCA",
    currencyCode: "IDR",
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    bankAccountCode: "BCA02",
    bankAccountName: "PT Arthamas Sejahtera Mulia",
    bankAccountNumber: "534234234",
    bankName: "BCA",
    currencyCode: "USD",
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    bankAccountCode: "CIMB01",
    bankAccountName: "PT Arthamas Sejahtera Mulia",
    bankAccountNumber: "7283748293434",
    bankName: "CIMB NIAGA",
    currencyCode: "IDR",
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
];
