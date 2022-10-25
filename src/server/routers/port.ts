import { protectedProcedure } from "./../trpc";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { router } from "../trpc";

export const portSchema = z.object({
  portCode: z.string().max(20),
  name: z.string().max(40),
  address: z.string().nullable(),
  area: z.string().max(20),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
});

export const portRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.port.findMany({
      where: { orgCode: ctx.user.orgCode },
    });
    return { data };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.port.findUnique({
      where: {
        portCode_orgCode: {
          orgCode: ctx.user.orgCode,
          portCode: input,
        },
      },
    });
    return { data };
  }),

  create: protectedProcedure
    .input(portSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.port.create({
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
      portSchema.omit({ portCode: true }).partial().extend({
        portCode: portSchema.shape.portCode,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { portCode, ...updatedFields } = input;
      const data = await prisma.port.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user!.username,
        },
        where: {
          portCode_orgCode: {
            portCode,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.port.delete({
        where: {
          portCode_orgCode: {
            portCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
});
