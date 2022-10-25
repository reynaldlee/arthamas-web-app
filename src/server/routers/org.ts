import { protectedProcedure } from "./../trpc";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";
import { router } from "../trpc";

const orgSchema = z.object({
  orgCode: z.string().max(20),
  name: z.string().max(40),
  address: z.string().optional(),
  code: z.string().max(10),
});

export const orgRouter = router({
  findAll: protectedProcedure.query(async () => {
    const data = await prisma.org.findMany();
    return { data };
  }),
  me: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.userOrg.findMany({
      where: {
        user: { id: ctx.user?.id },
      },
      include: {
        org: { select: { name: true } },
      },
    });

    return {
      data: data,
      selectedOrgCode: ctx.user?.orgCode,
    };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ input }) => {
    const data = await prisma.org.findUnique({
      where: {
        orgCode: input,
      },
    });
    return { data };
  }),

  create: protectedProcedure
    .input(orgSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.org.create({
        data: {
          orgCode: input.orgCode,
          address: input.address || "",
          name: input.name,
          code: input.code,
          createdBy: ctx.user!.username,
          updatedBy: ctx.user!.username,
        },
      });

      return { data };
    }),
  update: protectedProcedure
    .input(
      orgSchema.partial().omit({ orgCode: true }).extend({
        orgCode: orgSchema.shape.orgCode,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { orgCode, ...updatedFields } = input;
      const data = await prisma.org.update({
        data: {
          ...updatedFields,
          createdBy: ctx.user!.username,
          updatedBy: ctx.user!.username,
        },
        where: { orgCode },
      });

      return { data };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.org.delete({
        where: {
          orgCode: input,
        },
      });

      return { data };
    }),
});
