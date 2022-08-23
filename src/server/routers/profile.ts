import { TRPCError } from "@trpc/server";
import { TRPCClientError } from "@trpc/client";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";
import * as bcrypt from "bcrypt";

export const profileRouter = createProtectedRouter()
  .query("me", {
    resolve: async ({ ctx }) => {
      const data = await prisma.user.findFirst({
        where: {
          id: ctx.user.id,
        },
        select: {
          name: true,
          username: true,
          email: true,
          role: true,
        },
      });
      return { data };
    },
  })
  .mutation("changePassword", {
    input: z.object({
      oldPassword: z.string(),
      newPassword: z.string().min(6, {
        message: "Password harus minimal 6 karakter",
      }),
    }),
    resolve: async ({ input, ctx }) => {
      const user = await prisma.user.findFirst({
        where: {
          id: ctx.user.id,
        },
      });

      if (!(await bcrypt.compare(input.oldPassword, user?.password!))) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Password lama tidak sesuai",
        });
      }

      const updatedData = await prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          password: await bcrypt.hash(input.newPassword, 10),
          updatedBy: ctx.user.username,
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
        },
      });

      return { data: updatedData };
    },
  });
