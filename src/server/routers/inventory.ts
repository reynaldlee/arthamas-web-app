import { protectedProcedure } from "./../trpc";
import { productSchema } from "src/server/routers/product";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";
import { router } from "../trpc";

export const inventoryRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
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
  }),

  findAllByProduct: protectedProcedure
    .input(productSchema.shape.productCode)
    .query(async ({ input, ctx }) => {
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
    }),
});
