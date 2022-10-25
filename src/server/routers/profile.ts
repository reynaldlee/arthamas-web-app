import { protectedProcedure } from "./../trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import * as bcrypt from "bcrypt";
import { router } from "../trpc";

export const profileRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
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
  }),

  changePassword: protectedProcedure
    .input(
      z.object({
        oldPassword: z.string(),
        newPassword: z.string().min(6, {
          message: "Password harus minimal 6 karakter",
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
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
    }),
});
