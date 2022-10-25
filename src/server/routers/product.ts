import { protectedProcedure } from "./../trpc";
import { Prisma } from "@prisma/client";
import { productTypeSchema } from "./productType";
import { unitSchema } from "./unit";
import { productGradeSchema } from "./productGrade";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";
import { productCategorySchema } from "./productCategory";
import { router } from "../trpc";

export const productPackagingSchema = z.object({
  productCode: z.string(),
  packagingCode: z.string(),
  unitCode: z.string(),
  unitQty: z.number(),
});

export const productSchema = z.object({
  productCode: z.string().max(20),
  name: z.string().max(40),
  desc: z.string().optional(),
  sku: z.string().optional(),
  nptNumber: z.string().optional(),
  nptValidFrom: z.date().optional(),
  nptValidTo: z.date().optional(),
  productTypeCode: productTypeSchema.shape.productTypeCode,
  productGradeCode: productGradeSchema.shape.productGradeCode,
  productCategoryCode: productCategorySchema.shape.productCategoryCode,
  productUnit: z
    .array(unitSchema.omit({ volumes: true }))
    .optional()
    .nullable(),
});

export const productRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.product.findMany({
      where: { orgCode: ctx.user.orgCode },
      include: {
        productCategory: true,
        productType: true,
        productGrade: true,
        packagings: true,
      },
    });
    return { data };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.product.findUnique({
      where: {
        productCode_orgCode: {
          productCode: input,
          orgCode: ctx.user.orgCode,
        },
      },
      include: {
        productCategory: true,
        productType: true,
        productGrade: true,
        packagings: true,
      },
    });
    return { data };
  }),

  findProductPrices: protectedProcedure
    .input(productSchema.shape.productCode)
    .query(async ({ ctx, input }) => {
      const data = await prisma.productPrices.findMany({
        where: {
          productCode: input,
          orgCode: ctx.user.orgCode,
        },
        include: {
          product: true,
          customer: true,
          port: true,
          currency: true,
        },
      });
      return { data };
    }),

  findByVesselAndPort: protectedProcedure
    .input(
      z.object({
        vesselCode: z.string(),
        portCode: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const vessel = await prisma.vessel.findUnique({
        where: {
          vesselCode_orgCode: {
            vesselCode: input.vesselCode,
            orgCode: ctx.user.orgCode,
          },
        },
        select: { isAllProduct: true },
      });

      let where: Prisma.ProductFindManyArgs["where"] = {
        orgCode: ctx.user.orgCode,
      };

      //filter if isAllProduct
      if (!vessel?.isAllProduct) {
        where.vessels = {
          some: { vesselCode: input.vesselCode },
        };
      }

      const data = await prisma.product.findMany({
        where: where,
        include: {
          packagings: true,
          productCategory: true,
          productType: true,
          productGrade: true,
          productPrices: {
            where: {
              customer: {
                vessels: {
                  some: {
                    vesselCode: input.vesselCode,
                  },
                },
              },
              port: {
                portCode: input.portCode,
              },
            },
          },
        },
      });

      return { data };
    }),

  create: protectedProcedure
    .input(productSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.product.create({
        data: {
          ...input,
          unitPrice: 0,
          orgCode: ctx.user.orgCode,
          createdBy: ctx.user.username,
          updatedBy: ctx.user.username,
        },
      });

      return { data };
    }),

  update: protectedProcedure
    .input(
      productSchema.partial().omit({ productCode: true }).extend({
        productCode: productSchema.shape.productCode,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { productCode, ...updatedFields } = input;
      const data = await prisma.product.update({
        data: {
          ...updatedFields,
          updatedBy: ctx.user.username,
        },
        where: {
          productCode_orgCode: {
            productCode: input.productCode,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.product.delete({
        where: {
          productCode_orgCode: {
            productCode: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),

  addPackaging: protectedProcedure
    .input(productPackagingSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.productPackaging.create({
        data: {
          ...input,
          orgCode: ctx.user.orgCode,
          createdBy: ctx.user.username,
          updatedBy: ctx.user.username,
        },
      });

      return { data };
    }),
});
