import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

const roleSchema = z.object({
  roleId: z.string(),
  name: z.string().max(40),
});

export const roleRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.role.findMany();
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.role.findUnique({
        where: {
          roleId: input,
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: roleSchema,
    resolve: async ({ input, ctx }) => {
      const data = await prisma.role.create({
        data: {
          ...input,
          createdBy: ctx.user.username,
          updatedBy: ctx.user.username,
        },
      });

      return { data };
    },
  })
  .mutation("update", {
    input: roleSchema.partial(),
    resolve: async ({ input, ctx }) => {
      const { roleId, ...updatedFields } = input;
      const data = await prisma.role.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: { roleId },
      });

      return { data };
    },
  });
// .mutation("delete", {
//   input: z.string(),
//   resolve: async ({ input }) => {
//     const data = await prisma.role.delete({
//       where: { id: roleId },
//     });

//     return { data };
//   },
// });
