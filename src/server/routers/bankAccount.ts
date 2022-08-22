import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const bankAccountSchema = z.object({
  bankAccountCode: z.string().max(20),
  bankAccountNumber: z.string().max(20),
  bankAccountName: z.string().max(40),
  bankName: z.string().max(40),
  currencyCode: z.string().max(3),
});
export const portRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.bankAccount.findMany({
        where: { orgCode: ctx.user.orgCode },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.bankAccount.findUnique({
        where: {
          bankAccountCode_orgCode: {
            bankAccountCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: bankAccountSchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.bankAccount.create({
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
    input: bankAccountSchema.omit({ bankAccountCode: true }).partial().extend({
      bankAccountCode: bankAccountSchema.shape.bankAccountCode,
    }),
    resolve: async ({ input, ctx }) => {
      const { bankAccountCode, ...updatedFields } = input;
      const data = await prisma.bankAccount.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user!.username,
        },
        where: {
          bankAccountCode_orgCode: {
            bankAccountCode,
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
      const data = await prisma.bankAccount.delete({
        where: {
          bankAccountCode_orgCode: {
            bankAccountCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
