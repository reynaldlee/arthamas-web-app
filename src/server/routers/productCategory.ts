import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const productCategorySchema = z.object({
  productCategoryCode: z.string().max(20),
  name: z.string().max(40),
});

export const productCategoryRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.productCategory.findMany({
        where: { orgCode: ctx.user.orgCode },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.productCategory.findUnique({
        where: {
          productCategoryCode_orgCode: {
            productCategoryCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: productCategorySchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.productCategory.create({
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
    input: productCategorySchema
      .omit({ productCategoryCode: true })
      .partial()
      .extend({
        productCategoryCode: productCategorySchema.shape.productCategoryCode,
      }),
    resolve: async ({ input, ctx }) => {
      const { productCategoryCode, ...updatedFields } = input;
      const data = await prisma.productCategory.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          productCategoryCode_orgCode: {
            productCategoryCode: input.productCategoryCode,
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
      const data = await prisma.productCategory.delete({
        where: {
          productCategoryCode_orgCode: {
            productCategoryCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
