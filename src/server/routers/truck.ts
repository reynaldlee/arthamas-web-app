import { protectedProcedure } from "./../trpc";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { router } from "../trpc";

export const truckSchema = z.object({
  truckCode: z.string().max(20),
  policeNumber: z.string().max(10),
  name: z.string().max(40),
  type: z.string().max(40).optional().nullable(),
});

export const truckRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.truck.findMany({
      where: { orgCode: ctx.user.orgCode },
    });
    return { data };
  }),

  find: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const data = await prisma.truck.findUnique({
        where: {
          truckCode_orgCode: {
            truckCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    }),

  create: protectedProcedure
    .input(truckSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.truck.create({
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
      truckSchema.omit({ truckCode: true }).partial().extend({
        truckCode: truckSchema.shape.truckCode,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { truckCode, ...updatedFields } = input;
      const data = await prisma.truck.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          truckCode_orgCode: {
            truckCode: input.truckCode,
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
