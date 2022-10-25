import { protectedProcedure } from "./../trpc";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { router } from "../trpc";

export const productGradeSchema = z.object({
  productGradeCode: z.string().max(10),
  name: z.string().max(40),
});

export const productGradeRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.productGrade.findMany({
      where: { orgCode: ctx.user.orgCode },
    });
    console.log(data);

    return { data };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.productGrade.findUnique({
      where: {
        productGradeCode_orgCode: {
          productGradeCode: input,
          orgCode: ctx.user.orgCode,
        },
      },
    });
    return { data };
  }),

  create: protectedProcedure
    .input(productGradeSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.productGrade.create({
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
      productGradeSchema.omit({ productGradeCode: true }).partial().extend({
        productGradeCode: productGradeSchema.shape.productGradeCode,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { productGradeCode, ...updatedFields } = input;
      const data = await prisma.productGrade.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          productGradeCode_orgCode: {
            productGradeCode: input.productGradeCode,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.productGrade.delete({
        where: {
          productGradeCode_orgCode: {
            productGradeCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
});
