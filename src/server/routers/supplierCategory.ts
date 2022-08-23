import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const supplierCategorySchema = z.object({
  supplierCategoryCode: z.string().max(20),
  supplierCategoryName: z.string().max(40),
});

export const supplierCategoryRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.supplierCategory.findMany({
        where: { orgCode: ctx.user.orgCode },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.supplierCategory.findUnique({
        where: {
          supplierCategoryCode_orgCode: {
            supplierCategoryCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: supplierCategorySchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.supplierCategory.create({
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
    input: supplierCategorySchema
      .omit({ supplierCategoryCode: true })
      .partial()
      .extend({
        supplierCategoryCode: supplierCategorySchema.shape.supplierCategoryCode,
      }),
    resolve: async ({ input, ctx }) => {
      const { supplierCategoryCode, ...updatedFields } = input;
      const data = prisma.supplierCategory.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          supplierCategoryCode_orgCode: {
            supplierCategoryCode: input.supplierCategoryCode,
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
