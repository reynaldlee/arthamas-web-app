import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const currencySchema = z.object({
  currencyCode: z.string().max(3),
  name: z.string().max(40),
  rateIdr: z.number(),
});

export const currencyRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.currency.findMany({
        where: { orgCode: ctx.user.orgCode },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.currency.findUnique({
        where: {
          currencyCode_orgCode: {
            currencyCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: currencySchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.currency.create({
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
    input: currencySchema.omit({ currencyCode: true }).partial().extend({
      currencyCode: currencySchema.shape.currencyCode,
    }),
    resolve: async ({ input, ctx }) => {
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
    },
  })
  .mutation("delete", {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      const data = await prisma.currency.delete({
        where: {
          currencyCode_orgCode: {
            currencyCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
