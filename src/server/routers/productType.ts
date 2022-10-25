import { protectedProcedure } from "./../trpc";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { router } from "../trpc";

export const productTypeSchema = z.object({
  productTypeCode: z.string().max(10),
  name: z.string().max(40),
});

export const productTypeRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.productType.findMany({
      where: { orgCode: ctx.user.orgCode },
    });
    return { data };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.productType.findUnique({
      where: {
        productTypeCode_orgCode: {
          productTypeCode: input,
          orgCode: ctx.user.orgCode,
        },
      },
    });
    return { data };
  }),

  create: protectedProcedure
    .input(productTypeSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.productType.create({
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
      productTypeSchema.omit({ productTypeCode: true }).partial().extend({
        productTypeCode: productTypeSchema.shape.productTypeCode,
      })
    )
    .mutation(async ({ input, ctx }) => {
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
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.productType.delete({
        where: {
          productTypeCode_orgCode: {
            productTypeCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
});
