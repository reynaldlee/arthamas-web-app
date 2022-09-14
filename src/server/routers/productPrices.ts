import { portSchema } from "./port";
import { unitSchema } from "./unit";
import { productSchema } from "./product";
import { customerSchema } from "./customer";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const productPriceSchema = z.object({
  productCode: z.string().max(20),
  unitCode: z.string().max(10),
  portCode: z.string().max(10),
  customerCode: z.string().max(20),
  unitPrice: z.number(),
  currencyCode: z.string().max(3),
});

const productPriceKey = productPriceSchema.pick({
  customerCode: true,
  productCode: true,
  unitCode: true,
  portCode: true,
});

export const productPriceRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.productPrices.findMany({
        include: {
          customer: { select: { name: true } },
          port: { select: { name: true } },
        },
        where: { orgCode: ctx.user.orgCode },
      });
      return { data };
    },
  })
  .query("findAndGroupByCustomer", {
    resolve: async ({ ctx }) => {
      const data = await prisma.productPrices.groupBy({
        by: ["customerCode", "portCode"],
        _count: {
          customerCode: true,
        },
        where: { orgCode: ctx.user.orgCode },
      });

      return { data };
    },
  })
  .query("find", {
    input: productPriceKey,
    resolve: async ({ ctx, input }) => {
      const data = await prisma.productPrices.findUnique({
        where: {
          productCode_orgCode_portCode_customerCode: {
            ...input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: productPriceSchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.productPrices.create({
        data: {
          ...input,
          orgCode: ctx.user.orgCode,
          createdBy: ctx.user.username,
          updatedBy: ctx.user.username,
        },
      });

      return { data };
    },
  })
  .mutation("update", {
    input: productPriceSchema,
    resolve: async ({ input, ctx }) => {
      const { productCode, ...updatedFields } = input;
      const data = await prisma.productPrices.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          productCode_orgCode_portCode_customerCode: {
            ...input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  })
  .mutation("delete", {
    input: productPriceKey,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.productPrices.delete({
        where: {
          productCode_orgCode_portCode_customerCode: {
            ...input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
