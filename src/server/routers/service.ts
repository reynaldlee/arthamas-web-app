import { protectedProcedure } from "./../trpc";
import { currencySchema } from "./currency";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { router } from "../trpc";

export const serviceSchema = z.object({
  serviceCode: z.string().max(20),
  name: z.string().max(40),
  unitPrice: z.number(),
  currencyCode: currencySchema.shape.currencyCode,
});

export const serviceRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.service.findMany({
      where: { orgCode: ctx.user.orgCode },
    });
    return { data };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.service.findUnique({
      where: {
        serviceCode_orgCode: {
          serviceCode: input,
          orgCode: ctx.user.orgCode,
        },
      },
    });
    return { data };
  }),

  create: protectedProcedure
    .input(serviceSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.service.create({
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
      serviceSchema.partial().omit({ serviceCode: true }).extend({
        serviceCode: serviceSchema.shape.serviceCode,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { serviceCode, ...updatedFields } = input;
      const data = await prisma.service.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          serviceCode_orgCode: {
            serviceCode: input.serviceCode,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.service.delete({
        where: {
          serviceCode_orgCode: {
            serviceCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
});
