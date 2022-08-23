import { roleData } from "./seedData/roles";
import { productTypeData } from "./seedData/productType";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { productGradeData } from "./seedData/productGrade";
import { orgData } from "./seedData/org";
import { warehouseData } from "./seedData/warehouse";
import { areaData } from "./seedData/area";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (prisma) => {
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
          roleId: "SYSADMIN",
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

    await prisma.productGrade.createMany({
      skipDuplicates: true,
      data: productGradeData,
    });

    await prisma.area.createMany({
      skipDuplicates: true,
      data: areaData,
    });

    await prisma.warehouse.createMany({
      skipDuplicates: true,
      data: warehouseData,
    });

    await prisma.productType.createMany({
      skipDuplicates: true,
      data: productTypeData,
    });
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
