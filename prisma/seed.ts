import { bankAccountData } from "./seedData/bankAccount";
import { truckData } from "./seedData/truck";
import { unitData } from "./seedData/unit";
import { currencyData } from "./seedData/currency";
import { vesselData, vesselProductData } from "./seedData/vessel";
import { customerData } from "./seedData/customer";
import { portData } from "./seedData/port";
import { servicesData } from "./seedData/services";
import { packagingData } from "./seedData/packaging";
import { productCategoryData } from "./seedData/productCategory";
import { supplierData } from "./seedData/supplier";
import { roleData } from "./seedData/roles";
import { productTypeData } from "./seedData/productType";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { productGradeData } from "./seedData/productGrade";
import { orgData } from "./seedData/org";
import { warehouseData } from "./seedData/warehouse";
import { areaData } from "./seedData/area";
import { taxData } from "./seedData/tax";
import {
  productData,
  productPackagingData,
  productPricesData,
} from "./seedData/product";

const prisma = new PrismaClient();

async function main() {
  await prisma.org.createMany({
    skipDuplicates: true,
    data: orgData,
  });

  await prisma.role.createMany({
    skipDuplicates: true,
    data: roleData,
  });

  await prisma.user.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 1,
        name: "Administrator",
        username: "admin",
        roleId: "SADMIN",
        email: "admin@arthamas.biz",
        password: await bcrypt.hash("12345", 10),
        createdBy: "system",
        updatedBy: "system",
      },
    ],
  });

  await prisma.userOrg.createMany({
    skipDuplicates: true,
    data: [
      {
        userId: 1,
        orgCode: "ASM",
        isDefault: true,
      },
      {
        userId: 1,
        orgCode: "APG",
        isDefault: false,
      },
      {
        userId: 1,
        orgCode: "ATM",
        isDefault: false,
      },
    ],
  });

  await prisma.userOrg.createMany({
    skipDuplicates: true,
    data: [
      {
        orgCode: "ASM",
        userId: 1,
        isDefault: true,
      },
      {
        orgCode: "APG",
        userId: 1,
        isDefault: false,
      },
      {
        orgCode: "ATM",
        userId: 1,
        isDefault: false,
      },
    ],
  });

  await prisma.port.createMany({
    skipDuplicates: true,
    data: portData,
  });

  await prisma.bankAccount.createMany({
    skipDuplicates: true,
    data: bankAccountData,
  });

  await prisma.unit.createMany({
    skipDuplicates: true,
    data: unitData,
  });

  await prisma.packaging.createMany({
    skipDuplicates: true,
    data: packagingData,
  });

  await prisma.productCategory.createMany({
    skipDuplicates: true,
    data: productCategoryData,
  });

  await prisma.productGrade.createMany({
    skipDuplicates: true,
    data: productGradeData,
  });

  await prisma.currency.createMany({
    skipDuplicates: true,
    data: currencyData,
  });

  await prisma.area.createMany({
    skipDuplicates: true,
    data: areaData,
  });

  await prisma.warehouse.createMany({
    skipDuplicates: true,
    data: warehouseData,
  });

  await prisma.truck.createMany({
    skipDuplicates: true,
    data: truckData,
  });

  await prisma.tax.createMany({
    skipDuplicates: true,
    data: taxData,
  });

  await prisma.service.createMany({
    skipDuplicates: true,
    data: servicesData,
  });

  await prisma.productType.createMany({
    skipDuplicates: true,
    data: productTypeData,
  });

  await prisma.supplier.createMany({
    skipDuplicates: true,
    data: supplierData,
  });

  await prisma.product.createMany({
    skipDuplicates: true,
    data: productData,
  });

  await prisma.productPackaging.createMany({
    skipDuplicates: true,
    data: productPackagingData,
  });

  await prisma.productPrices.createMany({
    skipDuplicates: true,
    data: productPricesData,
  });

  await prisma.customer.createMany({
    skipDuplicates: true,
    data: customerData,
  });

  await prisma.vessel.createMany({
    skipDuplicates: true,
    data: vesselData,
  });

  await prisma.vesselProduct.createMany({
    skipDuplicates: true,
    data: vesselProductData,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
