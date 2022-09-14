import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const productTypeSchema = z.object({
  productTypeCode: z.string().max(10),
  name: z.string().max(40),
});

export const productTypeRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.productType.findMany({
        where: { orgCode: ctx.user.orgCode },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.productType.findUnique({
        where: {
          productTypeCode_orgCode: {
            productTypeCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: productTypeSchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.productType.create({
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
    input: productTypeSchema.omit({ productTypeCode: true }).partial().extend({
      productTypeCode: productTypeSchema.shape.productTypeCode,
    }),
    resolve: async ({ input, ctx }) => {
      const { productTypeCode, ...updatedFields } = input;
      const data = await prisma.productType.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          productTypeCode_orgCode: {
            productTypeCode: input.productTypeCode,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  })
  .mutation("delete", {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      const data = await prisma.productType.delete({
        where: {
          productTypeCode_orgCode: {
            productTypeCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
