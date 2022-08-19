import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

const warehouseSchema = z.object({
  warehouseCode: z.string().max(20),
  name: z.string().max(40),
  phone: z.string().max(20).optional(),
  address: z.string().optional(),
  areaCode: z.string().max(20),
});

export const warehouseRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.warehouse.findMany({
        where: { orgCode: ctx.user.orgCode },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.warehouse.findUnique({
        where: {
          warehouseCode_orgCode: {
            warehouseCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: warehouseSchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.warehouse.create({
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
    input: warehouseSchema.omit({ warehouseCode: true }).partial().extend({
      warehouseCode: warehouseSchema.shape.warehouseCode,
    }),
    resolve: async ({ input, ctx }) => {
      const { warehouseCode, ...updatedFields } = input;

      const data = await prisma.warehouse.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          warehouseCode_orgCode: {
            warehouseCode: input.warehouseCode,
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
      const data = await prisma.warehouse.delete({
        where: {
          warehouseCode_orgCode: {
            warehouseCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
