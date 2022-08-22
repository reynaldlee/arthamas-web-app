import { unitSchema } from "./unit";
import { productGradeSchema } from "./productGrade";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";
import { productCategorySchema } from "./productCategory";

export const productSchema = z.object({
  productCode: z.string().max(20),
  name: z.string().max(40),
  desc: z.string().optional(),
  sku: z.string().optional(),
  nptNumber: z.string().optional(),
  nptValidFrom: z.date().optional(),
  nptValidTo: z.date().optional(),
  gradeCode: productGradeSchema.shape.gradeCode,
  productCategoryCode: productCategorySchema.shape.productCategoryCode,
  productUnit: z.array(unitSchema.omit({ volumes: true })).optional(),
});

export const productRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.product.findMany({
        where: { orgCode: ctx.user.orgCode },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.product.findUnique({
        where: {
          productCode_orgCode: {
            productCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: productSchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.product.create({
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
    input: productSchema.partial().omit({ productCode: true }).extend({
      productCode: productSchema.shape.productCode,
    }),
    resolve: async ({ input, ctx }) => {
      const { productCode, ...updatedFields } = input;
      const data = await prisma.product.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          productCode_orgCode: {
            productCode: input.productCode,
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
      const data = await prisma.product.delete({
        where: {
          productCode_orgCode: {
            productCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
