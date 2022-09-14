import { Prisma } from "@prisma/client";

export const productData: Prisma.ProductCreateManyInput[] = [
  {
    productCode: "AMD3005",
    name: "ATLANTA MARINE D 3005",
    productGradeCode: "MAIN",
    nptNumber: "DP065E5003010919",
    nptValidFrom: new Date("2014-10-14"),
    nptValidTo: new Date("2019-09-30"),
    orgCode: "ASM",
    unitPrice: 0,
    productCategoryCode: "MARINELUB",
    productTypeCode: "MIN",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    productCode: "ATI3030",
    name: "AURELIA TI 3030",
    productGradeCode: "MAIN",
    nptNumber: "AAP011E4003010722",
    nptValidFrom: new Date("2017-08-02"),
    nptValidTo: new Date("2022-07-31"),
    orgCode: "ASM",
    unitPrice: 0,
    productCategoryCode: "MARINELUB",
    productTypeCode: "MIN",
    createdBy: "system",
    updatedBy: "system",
  },
];

export const productPackagingData: Prisma.ProductPackagingCreateManyInput[] = [
  {
    productCode: "AMD3005",
    packagingCode: "TANK",
    unitCode: "LTR",
    unitQty: 1000,
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    productCode: "AMD3005",
    packagingCode: "DRUM",
    unitCode: "LTR",
    unitQty: 205,
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    productCode: "ATI3030",
    packagingCode: "TANK",
    unitCode: "LTR",
    unitQty: 1000,
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    productCode: "ATI3030",
    packagingCode: "DRUM",
    unitCode: "LTR",
    unitQty: 205,
    orgCode: "ASM",
    createdBy: "system",
    updatedBy: "system",
  },
];

export const productPricesData: Prisma.ProductPricesCreateManyInput[] = [
  {
    productCode: "AMD3005",
    customerCode: "INDOBARUNA",
    orgCode: "ASM",
    portCode: "MRK",
    unitPrice: 1,
    currencyCode: "USD",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    productCode: "AMD3005",
    customerCode: "INDOBARUNA",
    orgCode: "ASM",
    portCode: "TNJPRK",
    unitPrice: 1.1,
    currencyCode: "USD",
    createdBy: "system",
    updatedBy: "system",
  },
];
