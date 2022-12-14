import { protectedProcedure, publicProcedure, router } from "./../trpc";
import { JwtPayload } from "./../../types/user.types";
import { prisma } from "@/prisma/index";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export const authRouter = router({
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.user.findFirst({
        where: {
          username: input.username,
        },
      });

      if (!data) {
        throw new TRPCError({
          message: "Username tidak ditemukan",
          code: "BAD_REQUEST",
        });
      }

      if (!(await bcrypt.compare(input.password, data.password))) {
        throw new TRPCError({
          message: "Username atau password salah",
          code: "BAD_REQUEST",
        });
      }

      const defaultOrg = await prisma.userOrg.findFirst({
        where: {
          userId: ctx.user?.id,
          isDefault: true,
        },
      });

      const jwtPayload: JwtPayload = {
        id: data.id,
        username: data.username,
        orgCode: defaultOrg?.orgCode!,
      };

      const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN!,
      });

      return {
        accessToken: accessToken,
      };
    }),

  changeOrg: protectedProcedure.input(z.string()).mutation(({ input, ctx }) => {
    const jwtPayload: JwtPayload = {
      id: ctx.user!.id,
      username: ctx.user!.username,
      orgCode: input,
    };

    const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN!,
    });

    return {
      accessToken: accessToken,
    };
  }),
});
