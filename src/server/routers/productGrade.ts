import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const productGradeSchema = z.object({
  productGradeCode: z.string().max(10),
  name: z.string().max(40),
});

export const productGradeRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.productGrade.findMany({
        where: { orgCode: ctx.user.orgCode },
      });
      console.log(data);

      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.productGrade.findUnique({
        where: {
          productGradeCode_orgCode: {
            productGradeCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: productGradeSchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.productGrade.create({
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
    input: productGradeSchema
      .omit({ productGradeCode: true })
      .partial()
      .extend({
        productGradeCode: productGradeSchema.shape.productGradeCode,
      }),
    resolve: async ({ input, ctx }) => {
      const { productGradeCode, ...updatedFields } = input;
      const data = await prisma.productGrade.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          productGradeCode_orgCode: {
            productGradeCode: input.productGradeCode,
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
      const data = await prisma.productGrade.delete({
        where: {
          productGradeCode_orgCode: {
            productGradeCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
