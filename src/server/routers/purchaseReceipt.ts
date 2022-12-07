import { protectedProcedure } from "./../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { warehouseSchema } from "./warehouse";
import { generateDocNo } from "../../utils/docNo";
import { packagingSchema } from "./packaging";
import { productSchema } from "src/server/routers/product";
import { prisma } from "@/prisma/index";
import { z } from "zod";

import {
  getPurchaseOrderToReceiptSummary,
  purchaseOrderItemSchema,
} from "./purchaseOrder";
import { router } from "../trpc";

export const purchaseReceiptItemSchema = z.object({
  productCode: productSchema.shape.productCode,
  packagingCode: packagingSchema.shape.packagingCode,
  purchaseOrderLineNo: purchaseOrderItemSchema.shape.lineNo,
  qty: z.number(),
  batchNo: z.string(),
  unitCode: z.string(),
  unitQty: z.number(),
  totalUnitQty: z.number(),
});

export const purchaseReceiptSchema = z.object({
  deliveryNoteNo: z.string().min(1),
  date: z.date(),
  memo: z.string().optional().nullable(),
  purchaseOrderDocNo: z.string(),
  purchaseReceiptItems: purchaseReceiptItemSchema.array(),
  warehouseCode: warehouseSchema.shape.warehouseCode,
});

export const purchaseReceiptRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.purchaseReceipt.findMany({
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
  }),
  findOpenStatus: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.purchaseReceipt.findMany({
      where: {
        orgCode: ctx.user.orgCode,
      },
      include: {
        warehouse: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { data };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.purchaseReceipt.findUnique({
      where: {
        docNo_orgCode: {
          docNo: input,
          orgCode: ctx.user.orgCode,
        },
      },
      include: {
        warehouse: { select: { name: true } },
        purchaseOrder: {
          include: {
            supplier: true,
          },
        },
        purchaseReceiptItems: {
          include: {
            purchaseOrderItem: true,
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
  }),

  create: protectedProcedure
    .input(purchaseReceiptSchema)
    .mutation(async ({ input, ctx }) => {
      const { purchaseReceiptItems, ...purchaseReceipt } = input;
      const docNo = generateDocNo("PR-");
      const orgCode = ctx.user.orgCode;

      const actualReceiptItems = purchaseReceiptItems.filter(
        (item) => item.qty > 0
      );

      if (actualReceiptItems.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No quantity received",
        });
      }

      const data = await prisma.$transaction(async (prisma) => {
        const pr = await prisma.purchaseReceipt.create({
          data: {
            docNo: docNo,
            memo: purchaseReceipt.memo,
            date: purchaseReceipt.date,
            purchaseOrder: {
              connect: {
                docNo_orgCode: {
                  docNo: purchaseReceipt.purchaseOrderDocNo,
                  orgCode: ctx.user.orgCode,
                },
              },
            },

            deliveryNoteNo: purchaseReceipt.deliveryNoteNo,
            purchaseReceiptItems: {
              createMany: {
                data: actualReceiptItems.map((item, index) => ({
                  ...item,
                  lineNo: index + 1,
                  purchaseOrderDocNo: purchaseReceipt.purchaseOrderDocNo,
                })),
              },
            },
            org: { connect: { orgCode: ctx.user.orgCode } },
            warehouse: {
              connect: {
                warehouseCode_orgCode: {
                  warehouseCode: purchaseReceipt.warehouseCode,
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
    }),
  update: protectedProcedure
    .input(
      z.object({
        docNo: z.string(),
        fields: purchaseReceiptSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { docNo, fields } = input;
      const { purchaseReceiptItems, ...updatedField } = fields;

      const data = await prisma.$transaction(async (prisma) => {
        await prisma.purchaseReceiptItem.deleteMany({
          where: {
            docNo: docNo,
            orgCode: ctx.user.orgCode,
          },
        });

        await prisma.purchaseReceiptItem.createMany({
          data: purchaseReceiptItems.map((item) => ({
            docNo: docNo,
            orgCode: ctx.user.orgCode,
            ...item,
          })),
        });

        // await prisma.purchaseReceiptServices.deleteMany({
        //   where: {
        //     docNo: docNo,
        //   },
        // });

        // await prisma.purchaseReceiptService.createMany({
        //   data: purchaseReceiptServices.map((item) => ({
        //     docNo: docNo,
        //     orgCode: ctx.user.orgCode,
        //     ...item,
        //   })) as any,
        // });

        return await prisma.purchaseReceipt.update({
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
    }),
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
