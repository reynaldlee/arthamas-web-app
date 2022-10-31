import { Prisma } from "@prisma/client";
import { protectedProcedure } from "./../trpc";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { router } from "../trpc";

export const warehouseSchema = z.object({
  warehouseCode: z.string().max(20),
  name: z.string().max(40),
  phone: z.string().max(20).optional(),
  address: z.string().optional(),
  areaCode: z.string().max(20),
});

export const warehouseRouter = router({
  findAll: protectedProcedure
    .input(
      z
        .object({
          warehouseCode: warehouseSchema.shape.warehouseCode
            .optional()
            .nullable(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const where: Prisma.WarehouseWhereInput = { orgCode: ctx.user.orgCode };

      if (input?.warehouseCode) {
        where.warehouseCode = input.warehouseCode;
      }

      const data = await prisma.warehouse.findMany({
        where: where,
        include: {
          area: { select: { areaCode: true, areaName: true } },
        },
      });
      return { data };
    }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.warehouse.findUnique({
      include: {
        area: { select: { areaCode: true, areaName: true } },
      },
      where: {
        warehouseCode_orgCode: {
          warehouseCode: input,
          orgCode: ctx.user.orgCode,
        },
      },
    });
    return { data };
  }),

  create: protectedProcedure
    .input(warehouseSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.warehouse.create({
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
      warehouseSchema.omit({ warehouseCode: true }).partial().extend({
        warehouseCode: warehouseSchema.shape.warehouseCode,
      })
    )
    .mutation(async ({ input, ctx }) => {
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
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.warehouse.delete({
        where: {
          warehouseCode_orgCode: {
            warehouseCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
});
