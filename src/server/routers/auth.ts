import { prisma } from "@/prisma/index";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../createRouter";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export const authRouter = createRouter().mutation("login", {
  input: z.object({
    username: z.string(),
    password: z.string(),
  }),
  async resolve({ input }) {
    const data = await prisma.user.findFirst({
      where: {
        username: input.username,
      },
    });

    if (!data) {
      throw new TRPCError({
        message: "Username atau password salah",
        code: "BAD_REQUEST",
      });
    }

    if (!(await bcrypt.compare(input.password, data.password))) {
      throw new TRPCError({
        message: "Username atau password salah",
        code: "BAD_REQUEST",
      });
    }

    const accessToken = jwt.sign(
      { id: data.id, username: data.username },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN! }
    );

    return {
      accessToken: accessToken,
    };
  },
});
