import { protectedProcedure } from "./../trpc";
import { prisma } from "@/prisma/index";
import { z } from "zod";

import { router } from "../trpc";

export const productCategorySchema = z.object({
  productCategoryCode: z.string().max(20),
  name: z.string().max(40),
});

export const productCategoryRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.productCategory.findMany({
      where: { orgCode: ctx.user.orgCode },
    });
    return { data };
  }),
  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.productCategory.findUnique({
      where: {
        productCategoryCode_orgCode: {
          productCategoryCode: input,
          orgCode: ctx.user.orgCode,
        },
      },
    });
    return { data };
  }),
  create: protectedProcedure
    .input(productCategorySchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.productCategory.create({
        data: {
          ...input,
          orgCode: ctx.user.orgCode,
          createdBy: ctx.user.username,
          updatedBy: ctx.user.username,
        },
      });

      return { data };
    }),
  update: protectedProcedure
    .input(
      productCategorySchema
        .omit({ productCategoryCode: true })
        .partial()
        .extend({
          productCategoryCode: productCategorySchema.shape.productCategoryCode,
        })
    )
    .mutation(async ({ input, ctx }) => {
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
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.productCategory.delete({
        where: {
          productCategoryCode_orgCode: {
            productCategoryCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
});
