import { protectedProcedure } from "./../trpc";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { router } from "../trpc";

export const taxSchema = z.object({
  taxCode: z.string().max(10),
  name: z.string().max(40),
  taxRate: z.number().min(0).max(1),
});

export const taxRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.tax.findMany({
      where: { orgCode: ctx.user.orgCode },
    });
    return { data };
  }),

  find: protectedProcedure
    .input(taxSchema.shape.taxCode)
    .mutation(async ({ ctx, input }) => {
      const data = await prisma.tax.findUnique({
        where: {
          taxCode_orgCode: {
            taxCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    }),

  create: protectedProcedure
    .input(taxSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.tax.create({
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
    .input(taxSchema)
    .mutation(async ({ input, ctx }) => {
      const { taxCode, ...updatedFields } = input;
      const data = await prisma.tax.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user!.username,
        },
        where: {
          taxCode_orgCode: {
            taxCode: input.taxCode,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
  delete: protectedProcedure
    .input(taxSchema.shape.taxCode)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.tax.delete({
        where: {
          taxCode_orgCode: {
            taxCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
});
