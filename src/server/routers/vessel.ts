import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";
import { productSchema } from "./product";

const vesselProductSchema = z.object({
  productCode: z.string().max(20),
});

const vesselSchema = z.object({
  vesselCode: z.string().max(20),
  regNo: z.string().max(40),
  vesselType: z.string().max(40).optional(),
  imoNumber: z.string().max(40).optional(),
  teus: z.string().max(40).optional(),
  name: z.string().max(40),
  customerCode: z.string().max(20),
});

export const vesselRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.vessel.findMany({
        where: { orgCode: ctx.user.orgCode },
        include: {
          customer: {
            select: {
              name: true,
            },
          },
        },
      });
      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.vessel.findUnique({
        where: {
          vesselCode_orgCode: {
            vesselCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });
      return { data };
    },
  })
  .query("getVesselProducts", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.vesselProduct.findMany({
        where: {
          vesselCode: input,
          orgCode: ctx.user.orgCode,
        },
        include: {
          product: true,
        },
      });
      return { data };
    },
  })
  .query("findByCustomerCode", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.vessel.findMany({
        where: {
          customerCode: input,
          orgCode: ctx.user.orgCode,
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: vesselSchema.extend({
      products: z.array(vesselProductSchema).optional(),
    }),
    resolve: async ({ input, ctx }) => {
      const data = await prisma.vessel.create({
        data: {
          ...input,
          orgCode: ctx.user.orgCode,
          createdBy: ctx.user.username,
          updatedBy: ctx.user.username,
        },
      });

      return { data };
    },
  })
  .mutation("update", {
    input: vesselSchema.omit({ vesselCode: true }).partial().extend({
      vesselCode: vesselSchema.shape.vesselCode,
    }),
    resolve: async ({ input, ctx }) => {
      const { vesselCode, ...updatedFields } = input;
      const data = await prisma.vessel.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          vesselCode_orgCode: {
            vesselCode: vesselCode,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  })
  .mutation("addProducts", {
    input: z.object({
      productCode: productSchema.shape.productCode,
      vesselCode: vesselSchema.shape.vesselCode,
    }),
    resolve: async ({ input, ctx }) => {
      const result = await prisma.vesselProduct.create({
        data: {
          vesselCode: input.vesselCode,
          productCode: input.productCode,
          orgCode: ctx.user.orgCode,
        },
      });

      return { data: result };
    },
  })

  .mutation("updateProducts", {
    input: z.object({
      vesselCode: vesselSchema.shape.vesselCode,
      products: z.array(vesselProductSchema).nonempty(),
    }),
    resolve: async ({ input, ctx }) => {
      //remove previous vesselProduct
      const result = await prisma.$transaction(async (prisma) => {
        await prisma.vesselProduct.deleteMany({
          where: {
            vesselCode: input.vesselCode,
            orgCode: ctx.user.orgCode,
          },
        });

        //re-add vessel Products
        const result = await prisma.vesselProduct.createMany({
          data: input.products.map((item) => ({
            orgCode: ctx.user.orgCode,
            productCode: item.productCode,
            vesselCode: input.vesselCode,
          })),
        });

        return result;
      });

      return result;
    },
  })
  .mutation("delete", {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      const data = await prisma.vessel.delete({
        where: {
          vesselCode_orgCode: {
            vesselCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
