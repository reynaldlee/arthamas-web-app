import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const productGradeSchema = z.object({
  gradeCode: z.string().max(10),
  gradeName: z.string().max(40),
});

export const productGradeRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.productGrade.findMany({
        where: { orgCode: ctx.user.orgCode },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.productGrade.findUnique({
        where: {
          gradeCode_orgCode: {
            gradeCode: input,
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
    input: productGradeSchema.omit({ gradeCode: true }).partial().extend({
      gradeCode: productGradeSchema.shape.gradeCode,
    }),
    resolve: async ({ input, ctx }) => {
      const { gradeCode, ...updatedFields } = input;
      const data = await prisma.productGrade.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          gradeCode_orgCode: {
            gradeCode: input.gradeCode,
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
          gradeCode_orgCode: {
            gradeCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
