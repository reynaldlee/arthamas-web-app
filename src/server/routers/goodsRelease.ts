import { Prisma } from "@prisma/client";
import { generateDocNo } from "../../utils/docNo";
import { format } from "date-fns";
import { serviceSchema } from "./service";
import { packagingSchema } from "./packaging";
import { productSchema } from "src/server/routers/product";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

// const a: Prisma.SalesQuoteServiceCreateManySalesQuoteInput;

export const goodsReleaseOrderItemSchema = z.object({
  lineNo: z.number().min(1),
  productCode: productSchema.shape.productCode,
  packagingCode: packagingSchema.shape.packagingCode,
  desc: z.string().optional(),
  qty: z.number(),
  unitCode: z.string(),
  unitQty: z.number(),
  totalUnitQty: z.number(),
  salesOrderItemDocNo: z.string(),
  salesOrderItemLineNo: z.number(),
});

export const goodsReleaseOrderSchema = z.object({
  salesOrderDocNo: z.string(),
  deliveryDate: z.string(),
  warehouseCode: z.string(),
  memo: z.string().optional().nullable(),
  goodsReleaseOrderItems: z
    .array(goodsReleaseOrderItemSchema)
    .optional()
    .default([]),
});

export const goodsReleaseOrderRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.goodsReleaseOrder.findMany({
        where: { orgCode: ctx.user.orgCode },
        include: {
          salesOrder: {
            include: {
              customer: { select: { name: true } },
            },
          },
          warehouse: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.goodsReleaseOrder.findUnique({
        where: {
          docNo_orgCode: {
            docNo: input,
            orgCode: ctx.user.orgCode,
          },
        },
        include: {
          goodsReleaseOrderItems: {
            include: {
              product: true,
              productPackaging: true,
            },
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: goodsReleaseOrderSchema,
    resolve: async ({ input, ctx }) => {
      const { goodsReleaseOrderItems, ...goodsRelease } = input;
      const docNo = generateDocNo("GR-");

      const data = await prisma.$transaction(async (prisma) => {
        await prisma.salesOrder.update({
          data: {
            status: "OnProgress",
          },
          where: {
            docNo_orgCode: {
              docNo: input.salesOrderDocNo,
              orgCode: ctx.user.orgCode,
            },
          },
        });

        const goodsReleaseResult = await prisma.goodsReleaseOrder.create({
          data: {
            docNo: docNo,
            ...goodsRelease,
            deliveryDate: new Date(input.deliveryDate),
            status: "Open",
            orgCode: ctx.user.orgCode,
            goodsReleaseOrderItems: {
              createMany: {
                data: goodsReleaseOrderItems as any,
              },
            },
            createdBy: ctx.user.username,
            updatedBy: ctx.user.username,
          },
        });

        return goodsReleaseResult;
      });

      return { data };
    },
  })
  .mutation("update", {
    input: z.object({
      docNo: z.string(),
      fields: goodsReleaseOrderSchema,
    }),
    resolve: async ({ input, ctx }) => {
      const { docNo, fields } = input;
      const { goodsReleaseOrderItems, ...others } = fields;

      const data = await prisma.$transaction(async (prisma) => {
        await prisma.goodsReleaseOrderItem.deleteMany({
          where: {
            docNo: docNo,
            orgCode: ctx.user.orgCode,
          },
        });

        await prisma.goodsReleaseOrderItem.createMany({
          data: goodsReleaseOrderItems.map((item) => ({
            docNo: docNo,
            ...item,
          })) as any,
        });

        return await prisma.goodsReleaseOrder.update({
          data: { ...others, updatedBy: ctx.user.username },
          where: {
            docNo_orgCode: {
              docNo: input.docNo,
              orgCode: ctx.user.orgCode,
            },
          },
        });
      });

      return { data };
    },
  })
  .mutation("cancel", {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      const data = await prisma.goodsReleaseOrder.update({
        data: {
          status: "Cancelled",
          cancelledBy: ctx.user.username,
          cancelledAt: new Date(),
        },
        where: {
          docNo_orgCode: {
            docNo: input,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    },
  });
