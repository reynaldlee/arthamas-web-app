import { prisma } from "@/prisma/index";
import { string, z } from "zod";
import { createProtectedRouter } from "../createRouter";

const userOrgSchema = z.object({
  orgCode: z.string(),
  isDefault: z.boolean(),
});

const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().max(40),
  username: z.string().max(20),
  email: z.string().email(),
  password: z.string(),
  roleId: z.string().max(10),
});

export const userRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.user.findMany({
        where: {
          orgs: { some: { orgCode: ctx.user.orgCode } },
        },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.number(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.user.findUnique({
        where: {
          id: input,
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: userSchema.and(
      z.object({
        orgs: z.array(userOrgSchema),
      })
    ),
    resolve: async ({ input, ctx }) => {
      const data = await prisma.user.create({
        data: {
          ...input,
          orgs: {
            createMany: {
              data: (input.orgs || []).map((item) => ({
                isDefault: item.isDefault,
                orgCode: item.orgCode,
              })),
            },
          },
          createdBy: ctx.user.username,
          updatedBy: ctx.user.username,
        },
      });

      return { data };
    },
  })
  .mutation("update", {
    input: userSchema.partial(),
    resolve: async ({ input, ctx }) => {
      const { id, ...updatedFields } = input;
      const data = await prisma.user.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: { id },
      });

      return { data };
    },
  })
  .mutation("updateOrgs", {
    input: z.object({
      id: z.number(),
      orgs: z.array(userOrgSchema),
    }),
    resolve: async ({ input }) => {
      const result = await prisma.$transaction(async (prisma) => {
        await prisma.userOrg.deleteMany({
          where: {
            userId: input.id,
          },
        });

        return await prisma.userOrg.createMany({
          data: input.orgs.map((item) => ({
            userId: input.id,
            orgCode: item.orgCode,
            isDefault: item.isDefault,
          })),
        });
      });

      return { data: result };
    },
  })
  .mutation("delete", {
    input: z.number(),
    resolve: async ({ input }) => {
      const data = await prisma.user.delete({
        where: { id: input },
      });

      return { data };
    },
  });
