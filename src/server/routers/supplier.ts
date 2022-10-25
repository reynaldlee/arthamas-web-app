import { protectedProcedure } from "./../trpc";
import { prisma } from "@/prisma/index";
import { z } from "zod";

import { router } from "../trpc";

export const supplierSchema = z.object({
  supplierCode: z.string().max(20),
  name: z.string().max(40),
  phone: z.string().max(20).optional().nullable(),
  address: z.string().optional().nullable(),
  contactEmail: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  top: z.number(),
  NPWP: z.string().optional().nullable(),
  NPWPAddress: z.string().optional().nullable(),
  supplierCategoryCode: z.string().max(20).optional().nullable(),
});

export const supplierRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.supplier.findMany({
      where: { orgCode: ctx.user.orgCode },
      include: {
        supplierCategory: true,
      },
    });
    return { data };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.supplier.findUnique({
      where: {
        supplierCode_orgCode: {
          supplierCode: input,
          orgCode: ctx.user.orgCode,
        },
      },
      include: { supplierCategory: true },
    });
    return { data };
  }),

  create: protectedProcedure
    .input(supplierSchema)
    .mutation(async ({ input, ctx }) => {
      // console.log(input);
      const data = await prisma.supplier.create({
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
      supplierSchema.omit({ supplierCode: true }).partial().extend({
        supplierCode: supplierSchema.shape.supplierCode,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { supplierCode, ...updatedFields } = input;
      const data = await prisma.supplier.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          supplierCode_orgCode: {
            supplierCode: input.supplierCode,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.truck.delete({
        where: {
          truckCode_orgCode: {
            truckCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
});
