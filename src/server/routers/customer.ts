import { customerGroupSchema } from "./customerGroup";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const customerSchema = z.object({
  customerCode: z.string().max(20),
  name: z.string().max(40),
  address: z.string().optional(),
  type: z.string().optional(),
  NPWP: z.string().optional(),
  NPWPAddress: z.string().optional(),
  customerGroupCode: customerGroupSchema.shape.customerGroupCode,
});

export const customerRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.customer.findMany({
        where: { orgCode: ctx.user.orgCode },
        include: { customerGroup: true },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.customer.findUnique({
        where: {
          customerCode_orgCode: {
            customerCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: customerSchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.customer.create({
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
    input: customerSchema.partial({}),
    resolve: async ({ input, ctx }) => {
      const { customerGroupCode, ...updatedFields } = input;
      const data = await prisma.customer.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          customerCode_orgCode: {
            customerCode: input.customerCode,
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
      const data = await prisma.customer.delete({
        where: {
          customerCode_orgCode: {
            customerCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
