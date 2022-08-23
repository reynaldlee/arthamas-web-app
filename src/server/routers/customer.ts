import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";
import { customerGroupSchema } from "./customerGroup";

export const customerSchema = z.object({
  customerCode: z.string().max(20),
  name: z.string().max(40),
  address: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  NPWP: z.string().optional().nullable(),
  NPWPAddress: z.string().optional().nullable(),
  top: z.number(),
  contactEmail: z.string().email().optional().nullable(),
  customerGroupCode: z.string().optional().nullable(),
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
    input: customerSchema.passthrough().extend({
      customerGroup: customerGroupSchema
        .pick({
          customerGroupCode: true,
          name: true,
        })
        .nullable()
        .optional(),
    }),
    resolve: async ({ input, ctx }) => {
      const data = await prisma.customer.create({
        data: {
          customerCode: input.customerCode,
          name: input.name,
          address: input.address,
          top: input.top,
          NPWP: input.NPWP,
          NPWPAddress: input.NPWPAddress,
          customerGroupCode: input.customerGroup?.customerGroupCode,
          orgCode: ctx.user.orgCode,
          createdBy: ctx.user.username,
          updatedBy: ctx.user.username,
        },
      });

      return { data };
    },
  })
  .mutation("update", {
    input: customerSchema
      .omit({
        customerCode: true,
      })
      .partial()
      .extend({
        customerCode: customerSchema.shape.customerCode,
      }),
    resolve: async ({ input, ctx }) => {
      const { customerCode, ...updatedFields } = input;
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
