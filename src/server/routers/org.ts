import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const orgRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async () => {
      const data = await prisma.org.findMany();
      return { data };
    },
  })
  .query("me", {
    resolve: async ({ ctx }) => {
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
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ input }) => {
      const data = await prisma.org.findUnique({
        where: {
          orgCode: input,
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: z.object({
      orgCode: z.string().max(20),
      name: z.string().max(40),
      address: z.string().nullable(),
      code: z.string().max(10),
    }),
    resolve: async ({ input, ctx }) => {
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
    },
  })
  .mutation("update", {
    input: z.object({
      orgCode: z.string(),
      name: z.string().max(40).optional(),
      address: z.string().optional(),
      code: z.string().max(10).optional(),
    }),
    resolve: async ({ input, ctx }) => {
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
    },
  })
  .mutation("delete", {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      const data = await prisma.org.delete({
        where: {
          orgCode: input,
        },
      });

      return { data };
    },
  });
