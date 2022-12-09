import { protectedProcedure, router } from "./../trpc";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { customerGroupSchema } from "./customerGroup";

export const customerSchema = z.object({
  customerCode: z.string(),
  name: z.string().max(40),
  address: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  NPWP: z.string().optional().nullable(),
  NPWPAddress: z.string().optional().nullable(),
  top: z.number(),
  contactEmail: z.string().email().optional().nullable(),
  customerGroupCode: z.string().optional().nullable(),
});

export const customerRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.customer.findMany({
      where: { orgCode: ctx.user.orgCode },
      include: { customerGroup: true },
    });
    return { data };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    console.log(input);
    const data = await prisma.customer.findUnique({
      where: {
        customerCode_orgCode: {
          customerCode: input,
          orgCode: ctx.user.orgCode,
        },
      },

      include: {
        vessels: true,
      },
    });

    return { data };
  }),

  create: protectedProcedure
    .input(
      customerSchema.passthrough().extend({
        customerGroup: customerGroupSchema
          .pick({
            customerGroupCode: true,
            name: true,
          })
          .nullable()
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
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
    }),

  update: protectedProcedure
    .input(
      customerSchema
        .omit({
          customerCode: true,
        })
        .partial()
        .extend({
          customerCode: customerSchema.shape.customerCode,
        })
    )
    .mutation(async ({ input, ctx }) => {
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
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.customer.delete({
        where: {
          customerCode_orgCode: {
            customerCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
});
