import { productSchema } from "src/server/routers/product";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const inventoryRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.inventory.findMany({
        where: { orgCode: ctx.user.orgCode },
        include: {
          product: {
            include: {
              productCategory: true,
              productGrade: true,
              productType: true,
            },
          },
          productPackaging: true,
          warehouse: {
            select: { name: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return { data };
    },
  })
  .query("findAllByProduct", {
    input: productSchema.shape.productCode,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.inventory.findMany({
        where: { orgCode: ctx.user.orgCode, productCode: input },
        include: {
          productPackaging: true,
          warehouse: {
            select: { name: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return { data };
    },
  });
