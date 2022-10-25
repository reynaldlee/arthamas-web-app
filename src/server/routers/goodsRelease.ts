import { router, protectedProcedure } from "./../trpc";
import { TRPCClientError } from "@trpc/client";
import { Prisma } from "@prisma/client";
import { generateDocNo } from "../../utils/docNo";
import { format } from "date-fns";
import { serviceSchema } from "./service";
import { packagingSchema } from "./packaging";
import { productSchema } from "src/server/routers/product";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";
import { TRPCError } from "@trpc/server";

// const a: Prisma.SalesQuoteServiceCreateManySalesQuoteInput;

export const goodsReleaseOrderItemSchema = z.object({
  lineNo: z.number().min(1),
  productCode: productSchema.shape.productCode,
  packagingCode: packagingSchema.shape.packagingCode,
  desc: z.string().optional().nullable(),
  qty: z.number(),
  unitCode: z.string(),
  unitQty: z.number(),
  totalUnitQty: z.number(),
  salesOrderItemLineNo: z.number(),
  salesOrderItemDocNo: z.string(),
});

export const goodsReleaseOrderSchema = z.object({
  salesOrderDocNo: z.string(),
  deliveryDate: z.date(),
  warehouseCode: z.string(),
  memo: z.string().optional().nullable(),
  goodsReleaseOrderItems: z
    .array(goodsReleaseOrderItemSchema)
    .optional()
    .default([]),
});

export const goodsReleaseOrderRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
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
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.goodsReleaseOrder.findUnique({
      where: {
        docNo_orgCode: {
          docNo: input,
          orgCode: ctx.user.orgCode,
        },
      },
      include: {
        warehouse: true,
        salesOrder: {
          include: {
            customer: true,
          },
        },
        goodsReleaseOrderItems: {
          include: {
            product: {
              include: {
                productGrade: true,
                productType: true,
                productCategory: true,
              },
            },
            productPackaging: true,
          },
        },
      },
    });
    return { data };
  }),

  create: protectedProcedure
    .input(goodsReleaseOrderSchema)
    .mutation(async ({ input, ctx }) => {
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
            deliveryDate: input.deliveryDate,
            status: "Open",
            orgCode: ctx.user.orgCode,
            goodsReleaseOrderItems: {
              createMany: {
                data: goodsReleaseOrderItems.filter((item) => item.qty != 0),
              },
            },
            createdBy: ctx.user.username,
            updatedBy: ctx.user.username,
          },
        });

        return goodsReleaseResult;
      });

      return { data };
    }),

  update: protectedProcedure
    .input(
      z.object({
        docNo: z.string(),
        fields: goodsReleaseOrderSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { docNo, fields } = input;
      const { goodsReleaseOrderItems, ...others } = fields;

      const goodReleaseOrder = await prisma.goodsReleaseOrder.findUnique({
        where: {
          docNo_orgCode: {
            docNo: docNo,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      if (!goodReleaseOrder) {
        throw new TRPCError({
          message: "No SP2B tidak ditemukan",
          code: "BAD_REQUEST",
        });
      }

      const data = await prisma.$transaction(async (prisma) => {
        //remove old items

        await prisma.goodsReleaseOrderItem.deleteMany({
          where: {
            docNo: docNo,
            orgCode: goodReleaseOrder.orgCode,
          },
        });

        // re-create items
        await prisma.goodsReleaseOrderItem.createMany({
          data: goodsReleaseOrderItems
            .map((item) => ({
              docNo: docNo,
              orgCode: goodReleaseOrder.orgCode,
              ...item,
            }))
            .filter((item) => item.qty > 0),
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
      console.log("c");

      return { data };
    }),

  cancel: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
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
    }),
});
