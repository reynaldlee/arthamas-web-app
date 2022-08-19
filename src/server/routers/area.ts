import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const areaSchema = z.object({
  areaCode: z.string().max(20),
  areaName: z.string().max(40),
});

export const areaRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.area.findMany({
        where: { orgCode: ctx.user.orgCode },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.area.findUnique({
        where: {
          areaCode_orgCode: {
            areaCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: areaSchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.area.create({
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
    input: z
      .object({
        areaCode: areaSchema.shape.areaCode,
      })
      .merge(areaSchema.omit({ areaCode: true })),

    resolve: async ({ input, ctx }) => {
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
    },
  })
  .mutation("delete", {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      const data = await prisma.area.delete({
        where: {
          areaCode_orgCode: {
            areaCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
