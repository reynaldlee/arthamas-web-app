import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { warehouseSchema } from "./warehouse";
import { generateDocNo } from "../../utils/docNo";
import { packagingSchema } from "./packaging";
import { productSchema } from "src/server/routers/product";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";
import {
  getPurchaseOrderToReceiptSummary,
  purchaseOrderItemSchema,
} from "./purchaseOrder";

export const purchaseInvoiceItemSchema = z.object({
  productCode: productSchema.shape.productCode,
  packagingCode: packagingSchema.shape.packagingCode,
  purchaseOrderLineNo: purchaseOrderItemSchema.shape.lineNo,
  qty: z.number(),
  batchNo: z.string(),
  unitCode: z.string(),
  unitQty: z.number(),
  totalUnitQty: z.number(),
});

export const purchaseInvoiceSchema = z.object({
  deliveryNoteNo: z.string().min(1),
  date: z.date(),
  memo: z.string().optional().nullable(),
  purchaseOrderDocNo: z.string(),
  purchaseInvoiceItems: purchaseInvoiceItemSchema.array(),
  warehouseCode: warehouseSchema.shape.warehouseCode,
});

export const purchaseInvoiceRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.purchaseInvoice.findMany({
        where: { orgCode: ctx.user.orgCode },
        include: {
          warehouse: { select: { name: true } },
          purchaseOrder: {
            select: {
              supplier: { select: { supplierCode: true, name: true } },
              date: true,
              docNo: true,
              dueDate: true,
            },
          },
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
      const data = await prisma.purchaseInvoice.findUnique({
        where: {
          docNo_orgCode: {
            docNo: input,
            orgCode: ctx.user.orgCode,
          },
        },
        include: {
          warehouse: { select: { name: true } },
          purchaseOrder: {
            select: { docNo: true, supplier: true, orgCode: true },
          },
          purchaseInvoiceItems: {
            include: {
              product: true,
              packaging: true,
            },
          },
        },
      });

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No data found",
        });
      }

      return { data };
    },
  })
  .mutation("create", {
    input: purchaseInvoiceSchema,
    resolve: async ({ input, ctx }) => {
      const { purchaseInvoiceItems, ...purchaseInvoice } = input;
      const docNo = generateDocNo("PR-");
      const orgCode = ctx.user.orgCode;

      const actualReceiptItems = purchaseInvoiceItems.filter(
        (item) => item.qty > 0
      );

      if (actualReceiptItems.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No quantity received",
        });
      }

      const data = await prisma.$transaction(async (prisma) => {
        const pr = await prisma.purchaseInvoice.create({
          data: {
            docNo: docNo,
            memo: purchaseInvoice.memo,
            date: purchaseInvoice.date,
            purchaseOrder: {
              connect: {
                docNo_orgCode: {
                  docNo: purchaseInvoice.purchaseOrderDocNo,
                  orgCode: ctx.user.orgCode,
                },
              },
            },
            deliveryNoteNo: purchaseInvoice.deliveryNoteNo,
            purchaseInvoiceItems: {
              createMany: {
                data: actualReceiptItems.map((item, index) => ({
                  ...item,
                  lineNo: index + 1,
                  purchaseOrderDocNo: purchaseInvoice.purchaseOrderDocNo,
                })),
              },
            },
            org: { connect: { orgCode: ctx.user.orgCode } },
            warehouse: {
              connect: {
                warehouseCode_orgCode: {
                  warehouseCode: purchaseInvoice.warehouseCode,
                  orgCode: orgCode,
                },
              },
            },
            createdBy: ctx.user.username,
            updatedBy: ctx.user.username,
          },
        });

        await updatePurchaseOrderStatus(prisma, {
          docNo: input.purchaseOrderDocNo,
          orgCode: ctx.user.orgCode,
        });

        return pr;
      });

      return { data };
    },
  })
  .mutation("update", {
    input: z.object({
      docNo: z.string(),
      fields: purchaseInvoiceSchema,
    }),
    resolve: async ({ input, ctx }) => {
      const { docNo, fields } = input;
      const { purchaseInvoiceItems, ...updatedField } = fields;

      const data = await prisma.$transaction(async (prisma) => {
        await prisma.purchaseInvoiceItem.deleteMany({
          where: {
            docNo: docNo,
            orgCode: ctx.user.orgCode,
          },
        });

        await prisma.purchaseInvoiceItem.createMany({
          data: purchaseInvoiceItems.map((item) => ({
            docNo: docNo,
            orgCode: ctx.user.orgCode,
            ...item,
          })),
        });

        // await prisma.purchaseInvoiceServices.deleteMany({
        //   where: {
        //     docNo: docNo,
        //   },
        // });

        // await prisma.purchaseInvoiceService.createMany({
        //   data: purchaseInvoiceServices.map((item) => ({
        //     docNo: docNo,
        //     orgCode: ctx.user.orgCode,
        //     ...item,
        //   })) as any,
        // });

        return await prisma.purchaseInvoice.update({
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
  });

async function updatePurchaseOrderStatus(
  prisma: Prisma.TransactionClient,
  purchaseOrder: { orgCode: string; docNo: string }
) {
  const purchaseOrderSummary = await getPurchaseOrderToReceiptSummary(
    prisma,
    purchaseOrder
  );

  purchaseOrderSummary.forEach((item) => {
    if (item.qtyOrdered.lessThan(item.qtyReceived)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Qty received ${item.productCode} ${item.packagingCode} cannot be greater than qty PO`,
      });
    }
  });

  const isCompleted = purchaseOrderSummary.every((item) =>
    item.qtyOrdered.lessThanOrEqualTo(item.qtyReceived)
  );

  await prisma.purchaseOrder.update({
    data: {
      status: isCompleted ? "Completed" : "OnProgress",
    },
    where: {
      docNo_orgCode: purchaseOrder,
    },
  });
}
