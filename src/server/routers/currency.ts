import { protectedProcedure } from "./../trpc";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { router } from "../trpc";

export const currencySchema = z.object({
  currencyCode: z.string().max(3),
  name: z.string().max(40),
  rateIdr: z.number(),
});

export const currencyRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.currency.findMany({
      where: { orgCode: ctx.user.orgCode },
    });
    return { data };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.currency.findUnique({
      where: {
        currencyCode_orgCode: {
          currencyCode: input,
          orgCode: ctx.user.orgCode,
        },
      },
    });
    return { data };
  }),

  create: protectedProcedure
    .input(currencySchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.currency.create({
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
      currencySchema.omit({ currencyCode: true }).partial().extend({
        currencyCode: currencySchema.shape.currencyCode,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { currencyCode, ...updatedFields } = input;
      const data = await prisma.currency.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user!.username,
        },
        where: {
          currencyCode_orgCode: {
            currencyCode,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.currency.delete({
        where: {
          currencyCode_orgCode: {
            currencyCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
});
