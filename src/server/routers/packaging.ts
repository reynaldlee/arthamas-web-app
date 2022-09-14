import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const packagingSchema = z.object({
  packagingCode: z.string().max(10),
  name: z.string().max(40),
});

export const packagingRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.packaging.findMany({
        where: { orgCode: ctx.user.orgCode },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.packaging.findUnique({
        where: {
          packagingCode_orgCode: {
            packagingCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: packagingSchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.packaging.create({
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
    input: packagingSchema.omit({ packagingCode: true }).partial().extend({
      packagingCode: packagingSchema.shape.packagingCode,
    }),
    resolve: async ({ input, ctx }) => {
      const { packagingCode, ...updatedFields } = input;
      const data = await prisma.packaging.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user!.username,
        },
        where: {
          packagingCode_orgCode: {
            packagingCode,
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
      const data = await prisma.packaging.delete({
        where: {
          packagingCode_orgCode: {
            packagingCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
