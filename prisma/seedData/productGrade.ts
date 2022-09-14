import { Prisma } from "@prisma/client";

export const productGradeData: Prisma.ProductGradeCreateManyInput[] = [
  {
    productGradeCode: "MAIN",
    name: "Main Grade",
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    productGradeCode: "SECONDARY",
    name: "Secondary Grade",
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
];
