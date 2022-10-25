import { protectedProcedure, router } from "./../trpc";
import { prisma } from "@/prisma/index";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const bankAccountSchema = z.object({
  bankAccountCode: z.string().max(20),
  bankAccountNumber: z.string().max(20),
  bankAccountName: z.string().max(40),
  bankName: z.string().max(40),
  currencyCode: z.string().max(3),
});
export const bankAccountRouter = router({
  findAll: protectedProcedure
    .input(
      z
        .object({
          currencyCode: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const where: Prisma.BankAccountWhereInput = { orgCode: ctx.user.orgCode };

      if (input?.currencyCode) {
        where.currencyCode = input.currencyCode;
      }
      const data = await prisma.bankAccount.findMany({
        where: where,
      });
      return { data };
    }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.bankAccount.findUnique({
      where: {
        bankAccountCode_orgCode: {
          bankAccountCode: input,
          orgCode: ctx.user.orgCode,
        },
      },
    });
    return { data };
  }),

  create: protectedProcedure
    .input(bankAccountSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.bankAccount.create({
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
      bankAccountSchema.omit({ bankAccountCode: true }).partial().extend({
        bankAccountCode: bankAccountSchema.shape.bankAccountCode,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.bankAccount.delete({
        where: {
          bankAccountCode_orgCode: {
            bankAccountCode: input.bankAccountCode,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
});
