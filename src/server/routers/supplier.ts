import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

const supplierSchema = z.object({
  supplierCode: z.string().max(20),
  name: z.string().max(40),
  phone: z.string().max(20).optional(),
  address: z.string().optional(),
  type: z.string().optional(),
  top: z.number(),
  supplierCategoryCode: z.string().max(20),
});

export const supplierRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.supplier.findMany({
        where: { orgCode: ctx.user.orgCode },
        include: {
          supplierCategory: true,
        },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
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
    },
  })
  .mutation("create", {
    input: supplierSchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.supplier.create({
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
    input: supplierSchema.omit({ supplierCode: true }).partial().extend({
      supplierCode: supplierSchema.shape.supplierCode,
    }),
    resolve: async ({ input, ctx }) => {
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
    },
  })
  .mutation("delete", {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      const data = await prisma.truck.delete({
        where: {
          truckCode_orgCode: {
            truckCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
