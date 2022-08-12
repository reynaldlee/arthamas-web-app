import { Context } from "./../context";
import { prisma } from "./../../../prisma/index";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../createRouter";

export const orgRouter = createRouter()
  .query("findAll", {
    input: z.object({
      q: z.string(),
    }),
    async resolve({ input }) {
      const data = await prisma.org.findMany({
        select: {
          address: true,
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: z.object({
      orgCode: z.string(),
      name: z.string().max(40),
      address: z.string().nullable(),
      code: z.string().max(10),
    }),
    async resolve({ input, ctx }) {
      const data = await prisma.org.create({
        data: {
          orgCode: input.orgCode,
          address: input.address || "",
          name: input.name,
          code: input.code,
          createdBy: ctx.user,
          updatedBy: ctx.user,
        },
      });
    },
  });
