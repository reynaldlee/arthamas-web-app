import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

const truckSchema = z.object({
  truckCode: z.string().max(20),
  policeNumber: z.string().max(10),
  name: z.string().max(40),
  type: z.string().max(40),
});

export const truckRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.truck.findMany({
        where: { orgCode: ctx.user.orgCode },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.truck.findUnique({
        where: {
          truckCode_orgCode: {
            truckCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: truckSchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.truck.create({
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
    input: truckSchema.omit({ truckCode: true }).partial().extend({
      truckCode: truckSchema.shape.truckCode,
    }),
    resolve: async ({ input, ctx }) => {
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
