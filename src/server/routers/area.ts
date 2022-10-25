import { router, protectedProcedure } from "./../trpc";
import { prisma } from "@/prisma/index";
import { z } from "zod";

export const areaSchema = z.object({
  areaCode: z.string().max(20),
  areaName: z.string().max(40),
});

export const areaRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.area.findMany({
      where: { orgCode: ctx.user.orgCode },
    });
    return { data: data, meta: "Hello World" };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.area.findUnique({
      where: {
        areaCode_orgCode: {
          areaCode: input,
          orgCode: ctx.user.orgCode,
        },
      },
    });
    return { data };
  }),

  create: protectedProcedure
    .input(areaSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.area.create({
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
      z
        .object({
          areaCode: areaSchema.shape.areaCode,
        })
        .merge(areaSchema.omit({ areaCode: true }))
    )
    .mutation(async ({ input, ctx }) => {
      const { areaCode, ...updatedFields } = input;
      const data = await prisma.area.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          areaCode_orgCode: {
            areaCode: input.areaCode,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.area.delete({
        where: {
          areaCode_orgCode: {
            areaCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
});
