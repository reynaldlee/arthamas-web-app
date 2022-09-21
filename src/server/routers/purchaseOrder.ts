import { Prisma } from "@prisma/client";
import { generateDocNo } from "../../utils/docNo";
import { format } from "date-fns";
import { serviceSchema } from "./service";
import { packagingSchema } from "./packaging";
import { productSchema } from "src/server/routers/product";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const purchaseOrderItemSchema = z.object({
  lineNo: z.number().min(1),
  productCode: productSchema.shape.productCode,
  packagingCode: packagingSchema.shape.packagingCode,
  desc: z.string().optional(),
  qty: z.number(),
  unitCode: z.string(),
  unitQty: z.number(),
  totalUnitQty: z.number(),
  unitPrice: z.number(),
  amount: z.number(),
});

export const purchaseOrderServiceSchema = z.object({
  serviceCode: serviceSchema.shape.serviceCode,
  unitPrice: z.number(),
  amount: z.number(),
  desc: z.string().nullable().optional(),
});

export const purchaseOrderSchema = z.object({
  supplierCode: z.string(),
  currencyCode: z.string(),
  date: z.date(),
  dueDate: z.date(),
  exchangeRate: z.number(),
  warehouseCode: z.string(),
  shipTo: z.string(),
  totalProduct: z.number(),
  totalService: z.number(),
  taxAmount: z.number(),
  taxRate: z.number(),
  totalBeforeTax: z.number(),
  totalAmount: z.number(),
  memo: z.string().optional().nullable(),
  purchaseOrderItems: z.array(purchaseOrderItemSchema).optional().default([]),
  purchaseOrderServices: z
    .array(purchaseOrderServiceSchema)
    .optional()
    .default([]),
});

export const purchaseOrderRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.purchaseOrder.findMany({
        where: { orgCode: ctx.user.orgCode },
        include: {
          supplier: { select: { name: true } },
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
      const data = await prisma.purchaseOrder.findUnique({
        where: {
          docNo_orgCode: {
            docNo: input,
            orgCode: ctx.user.orgCode,
          },
        },
        include: {
          warehouse: true,
          supplier: true,
          purchaseOrderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return { data };
    },
  })
  .mutation("create", {
    input: purchaseOrderSchema,
    resolve: async ({ input, ctx }) => {
      const { purchaseOrderItems, ...purchaseOrder } = input;
      const docNo = generateDocNo("PO-");
      const orgCode = ctx.user.orgCode;

      const data = await prisma.$transaction(async (prisma) => {
        return await prisma.purchaseOrder.create({
          data: {
            docNo: docNo,
            memo: purchaseOrder.memo,
            shipTo: purchaseOrder.shipTo,
            taxAmount: purchaseOrder.taxAmount,
            taxRate: purchaseOrder.taxRate,
            totalAmount: purchaseOrder.totalAmount,
            totalBeforeTax: purchaseOrder.totalBeforeTax,
            date: purchaseOrder.date,
            dueDate: purchaseOrder.dueDate,
            status: "Open",
            currency: {
              connect: {
                currencyCode_orgCode: {
                  currencyCode: purchaseOrder.currencyCode,
                  orgCode: orgCode,
                },
              },
            },
            purchaseOrderItems: {
              createMany: {
                data: purchaseOrderItems.map((item) => ({
                  ...item,
                })),
              },
            },
            org: { connect: { orgCode: ctx.user.orgCode } },
            warehouse: {
              connect: {
                warehouseCode_orgCode: {
                  warehouseCode: purchaseOrder.warehouseCode,
                  orgCode: orgCode,
                },
              },
            },

            supplier: {
              connect: {
                supplierCode_orgCode: {
                  supplierCode: purchaseOrder.supplierCode,
                  orgCode: orgCode,
                },
              },
            },
            createdBy: ctx.user.username,
            updatedBy: ctx.user.username,
          },
        });
      });

      return { data };
    },
  })
  .mutation("update", {
    input: z.object({
      docNo: z.string(),
      fields: purchaseOrderSchema,
    }),
    resolve: async ({ input, ctx }) => {
      const { docNo, fields } = input;
      const { purchaseOrderItems, purchaseOrderServices, ...updatedField } =
        fields;

      const data = await prisma.$transaction(async (prisma) => {
        await prisma.purchaseOrderItem.deleteMany({
          where: {
            docNo: docNo,
          },
        });

        await prisma.purchaseOrderItem.createMany({
          data: purchaseOrderItems.map((item) => ({
            docNo: docNo,
            orgCode: ctx.user.orgCode,
            ...item,
          })),
        });

        // await prisma.purchaseOrderServices.deleteMany({
        //   where: {
        //     docNo: docNo,
        //   },
        // });

        // await prisma.purchaseOrderService.createMany({
        //   data: purchaseOrderServices.map((item) => ({
        //     docNo: docNo,
        //     orgCode: ctx.user.orgCode,
        //     ...item,
        //   })) as any,
        // });

        return await prisma.purchaseOrder.update({
          data: updatedField,
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
      const result = await prisma.$transaction(async (prisma) => {
        const data = await prisma.purchaseOrder.update({
          where: {
            docNo_orgCode: {
              docNo: input,
              orgCode: ctx.user.orgCode,
            },
          },
          data: {
            status: "Cancelled",
            cancelledBy: ctx.user.username,
            cancelledAt: new Date(),
          },
        });

        return data;
      });

      return { data: result };
    },
  });

async function updateSalesQuoteStatus(
  prisma: Prisma.TransactionClient,
  salesQuote: { orgCode: string; docNo: string }
) {
  const countSO = await prisma.purchaseOrder.count({
    where: {
      salesQuoteDocNo: salesQuote.docNo,
      orgCode: salesQuote.orgCode,
    },
  });

  await prisma.salesQuote.update({
    data: {
      status: countSO > 0 ? "Completed" : "Open",
    },
    where: {
      docNo_orgCode: salesQuote,
    },
  });
}
