import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (prisma) => {
    await prisma.org.createMany({
      data: [
        {
          orgCode: "10",
          name: "Arthamas Sejahtera Mulia",
          code: "ASM",
          address: "",
          createdBy: "system",
          updatedBy: "system",
        },
        {
          orgCode: "20",
          name: "Arthamas Petra Gemilang",
          code: "APG",
          address: "",
          createdBy: "system",
          updatedBy: "system",
        },
        {
          orgCode: "30",
          name: "Organization 3",
          code: "ORG",
          address: "",
          createdBy: "system",
          updatedBy: "system",
        },
      ],
      skipDuplicates: true,
    });

    const adminUser = await prisma.user.create({
      data: {
        name: "Administrator",
        username: "admin",
        email: "admin@arthamas.biz",
        password: await bcrypt.hash("12345", 10),
        createdBy: "system",
        updatedBy: "system",
        role: {
          create: {
            name: "Super Admin",
            org: {
              connect: {
                orgCode: "10",
              },
            },
            createdBy: "system",
            updatedBy: "system",
          },
        },
      },
    });

    await prisma.userOrg.create({
      data: {
        orgCode: "10",
        userId: adminUser.id,
        isDefault: true,
      },
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
