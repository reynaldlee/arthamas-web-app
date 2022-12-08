import { supplierSchema } from "./supplier";

import { unitSchema } from "./unit";

import { router, protectedProcedure } from "./../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { generateDocNo } from "../../utils/docNo";
import { packagingSchema } from "./packaging";
import { productSchema } from "src/server/routers/product";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { getPurchaseOrderToReceiptSummary } from "./purchaseOrder";
import { currencySchema } from "./currency";

export const purchaseInvoiceItemSchema = z.object({
  lineNo: z.number().min(1),
  productCode: productSchema.shape.productCode,
  packagingCode: packagingSchema.shape.packagingCode,
  purchaseReceiptDocNo: z.string(),
  qty: z.number(),
  unitPrice: z.number(),
  unitQty: z.number(),
  unitCode: unitSchema.shape.unitCode,
  totalUnitQty: z.number(),
  amount: z.number(),
});

export const purchaseInvoiceSchema = z.object({
  docNo: z.string(),
  date: z.date(),
  dueDate: z.date(),
  purchaseReceiptDocNo: z.string(),
  taxRate: z.number(),
  taxAmount: z.number(),
  supplierCode: supplierSchema.shape.supplierCode,
  withholdingTaxRate: z.number(),
  withholdingTaxAmount: z.number(),
  totalBeforeTax: z.number(),
  otherFees: z.number(),
  memo: z.string().optional().nullable(),
  totalAmount: z.number(),
  purchaseInvoiceItems: purchaseInvoiceItemSchema.array(),
});

export const purchaseInvoiceRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.purchaseInvoice.findMany({
      where: { orgCode: ctx.user.orgCode },
      include: {
        purchaseReceipt: {
          include: {
            warehouse: true,
            purchaseOrder: {
              include: {
                supplier: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { data };
  }),

  findOpenStatus: protectedProcedure
    .input(
      z.object({
        supplierCode: supplierSchema.shape.supplierCode,
      })
    )
    .query(async ({ input, ctx }) => {
      const data = await prisma.purchaseInvoice.findMany({
        where: {
          orgCode: ctx.user.orgCode,
          status: {
            in: ["Open", "Partial"],
          },
          supplierCode: input.supplierCode,
        },
        include: {
          purchaseReceipt: {
            include: {
              warehouse: true,
              purchaseOrder: {
                include: {
                  supplier: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return { data };
    }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.purchaseInvoice.findUnique({
      where: {
        docNo_orgCode: {
          docNo: input,
          orgCode: ctx.user.orgCode,
        },
      },
      include: {
        purchaseReceipt: true,
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
  }),

  create: protectedProcedure
    .input(purchaseInvoiceSchema)
    .mutation(async ({ input, ctx }) => {
      const { purchaseInvoiceItems, ...purchaseInvoice } = input;
      const docNo = input.docNo;

      const data = await prisma.$transaction(async (prisma) => {
        const inv = await prisma.purchaseInvoice.create({
          data: {
            docNo: docNo,
            ...purchaseInvoice,
            purchaseReceiptDocNo: undefined,
            supplierCode: undefined,
            status: "Open",
            org: { connect: { orgCode: ctx.user.orgCode } },
            createdBy: ctx.user.username,
            updatedBy: ctx.user.username,
            supplier: {
              connect: {
                supplierCode_orgCode: {
                  supplierCode: purchaseInvoice.supplierCode,
                  orgCode: ctx.user.orgCode,
                },
              },
            },
            purchaseReceipt: {
              connect: {
                docNo_orgCode: {
                  docNo: purchaseInvoice.purchaseReceiptDocNo,
                  orgCode: ctx.user.orgCode,
                },
              },
            },
            purchaseInvoiceItems: {
              createMany: {
                data: purchaseInvoiceItems.map((item, index) => ({
                  ...item,
                })),
              },
            },
          },
        });

        await updatePurchaseReceiptStatus(
          prisma,
          inv.purchaseReceiptDocNo,
          ctx.user.orgCode
        );

        return inv;
      });

      return { data };
    }),

  update: protectedProcedure
    .input(
      z.object({
        docNo: z.string(),
        fields: purchaseInvoiceSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
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
    }),
});

const updatePurchaseReceiptStatus = async (
  prisma: Prisma.TransactionClient,
  purchaseReceiptDocNo: string,
  orgCode: string
) => {
  const countPurchaseInvoice = await prisma.purchaseInvoice.count({
    where: {
      orgCode: orgCode,
      purchaseReceiptDocNo: purchaseReceiptDocNo,
      status: { not: "Cancelled" },
    },
  });

  if (countPurchaseInvoice > 0) {
    await prisma.purchaseReceipt.update({
      data: { status: "Completed" },
      where: {
        docNo_orgCode: { docNo: purchaseReceiptDocNo, orgCode: orgCode },
      },
    });
  }
};

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
