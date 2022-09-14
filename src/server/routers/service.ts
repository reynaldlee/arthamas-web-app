import { currencySchema } from "./currency";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const serviceSchema = z.object({
  serviceCode: z.string().max(20),
  name: z.string().max(40),
  unitPrice: z.number(),
  currencyCode: currencySchema.shape.currencyCode,
});

export const serviceRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.service.findMany({
        where: { orgCode: ctx.user.orgCode },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.service.findUnique({
        where: {
          serviceCode_orgCode: {
            serviceCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: serviceSchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.service.create({
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
    input: serviceSchema.partial().omit({ serviceCode: true }).extend({
      serviceCode: serviceSchema.shape.serviceCode,
    }),
    resolve: async ({ input, ctx }) => {
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
    },
  })
  .mutation("delete", {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      const data = await prisma.service.delete({
        where: {
          serviceCode_orgCode: {
            serviceCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
