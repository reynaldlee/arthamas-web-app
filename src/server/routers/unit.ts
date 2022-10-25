import { protectedProcedure } from "./../trpc";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";
import { router } from "../trpc";

export const unitSchema = z.object({
  unitCode: z.string().max(20),
  volumes: z.number(),
});

export const unitRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.unit.findMany({
      where: { orgCode: ctx.user.orgCode },
    });
    return { data };
  }),

  find: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const data = await prisma.unit.findUnique({
        where: {
          unitCode_orgCode: {
            orgCode: ctx.user.orgCode,
            unitCode: input,
          },
        },
      });
      return { data };
    }),

  create: protectedProcedure
    .input(unitSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.unit.create({
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
      unitSchema.omit({ unitCode: true }).partial().extend({
        unitCode: unitSchema.shape.unitCode,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { unitCode, ...updatedFields } = input;
      const data = await prisma.unit.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user!.username,
        },
        where: {
          unitCode_orgCode: {
            unitCode,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.unit.delete({
        where: {
          unitCode_orgCode: {
            unitCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
});
