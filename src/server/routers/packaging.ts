import { protectedProcedure, router } from "./../trpc";
import { prisma } from "@/prisma/index";
import { z } from "zod";

export const packagingSchema = z.object({
  packagingCode: z.string().max(10),
  name: z.string().max(40),
});

export const packagingRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.packaging.findMany({
      where: { orgCode: ctx.user.orgCode },
    });
    return { data };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.packaging.findUnique({
      where: {
        packagingCode_orgCode: {
          packagingCode: input,
          orgCode: ctx.user.orgCode,
        },
      },
    });
    return { data };
  }),

  create: protectedProcedure
    .input(packagingSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.packaging.create({
        data: {
          ...input,
          orgCode: ctx.user.orgCode,
          createdBy: ctx.user.username,
          updatedBy: ctx.user.username,
        },
      });

      return { data };
    }),

  update: protectedProcedure
    .input(
      packagingSchema.omit({ packagingCode: true }).partial().extend({
        packagingCode: packagingSchema.shape.packagingCode,
      })
    )
    .mutation(async ({ input, ctx }) => {
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
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.packaging.delete({
        where: {
          packagingCode_orgCode: {
            packagingCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
});
