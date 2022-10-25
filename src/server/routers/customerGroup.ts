import { protectedProcedure } from "./../trpc";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";
import { router } from "../trpc";

export const customerGroupSchema = z.object({
  customerGroupCode: z.string().max(20),
  name: z.string().max(40),
  phone: z.string().max(20).optional().nullable(),
  address: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
});

export const customerGroupRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.customerGroup.findMany({
      where: { orgCode: ctx.user.orgCode },
    });
    return { data };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.customerGroup.findUnique({
      where: {
        customerGroupCode_orgCode: {
          customerGroupCode: input,
          orgCode: ctx.user.orgCode,
        },
      },
    });
    return { data };
  }),

  create: protectedProcedure
    .input(customerGroupSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.customerGroup.create({
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
      customerGroupSchema.omit({ customerGroupCode: true }).partial().extend({
        customerGroupCode: customerGroupSchema.shape.customerGroupCode,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { customerGroupCode, ...updatedFields } = input;
      const data = await prisma.customerGroup.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          customerGroupCode_orgCode: {
            customerGroupCode: input.customerGroupCode,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.customerGroup.delete({
        where: {
          customerGroupCode_orgCode: {
            customerGroupCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
});
