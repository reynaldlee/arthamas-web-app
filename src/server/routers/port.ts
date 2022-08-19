import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

const portSchema = z.object({
  portCode: z.string().max(20),
  name: z.string().max(40),
  address: z.string().nullable(),
  area: z.string().max(20),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
});

export const portRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.port.findMany({
        where: { orgCode: ctx.user.orgCode },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.port.findUnique({
        where: {
          portCode_orgCode: {
            orgCode: ctx.user.orgCode,
            portCode: input,
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: portSchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.port.create({
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
    input: portSchema.omit({ portCode: true }).partial().extend({
      portCode: portSchema.shape.portCode,
    }),
    resolve: async ({ input, ctx }) => {
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
    },
  })
  .mutation("delete", {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      const data = await prisma.port.delete({
        where: {
          portCode_orgCode: {
            portCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
