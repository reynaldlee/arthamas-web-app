import { protectedProcedure } from "./../trpc";
import { prisma } from "@/prisma/index";
import { z } from "zod";

import { router } from "../trpc";

const roleSchema = z.object({
  roleId: z.string(),
  name: z.string().max(40),
});

export const roleRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.role.findMany();
    return { data };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.role.findUnique({
      where: {
        roleId: input,
      },
    });
    return { data };
  }),

  create: protectedProcedure
    .input(roleSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.role.create({
        data: {
          ...input,
          createdBy: ctx.user.username,
          updatedBy: ctx.user.username,
        },
      });

      return { data };
    }),

  update: protectedProcedure
    .input(roleSchema.partial())
    .mutation(async ({ input, ctx }) => {
      const { roleId, ...updatedFields } = input;
      const data = await prisma.role.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: { roleId },
      });

      return { data };
    }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    const data = await prisma.role.delete({
      where: { roleId: input },
    });

    return { data };
  }),
});
