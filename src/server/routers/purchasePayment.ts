import { protectedProcedure } from "./../trpc";
import { TRPCError } from "@trpc/server";

import { generateDocNo } from "../../utils/docNo";

import { prisma } from "@/prisma/index";
import { z } from "zod";

import { router } from "../trpc";
import { Prisma } from "@prisma/client";

export const purchasePaymentDetailSchema = z.object({
  purchaseInvoiceDocNo: z.string(),
  amount: z.number(),
});

export const purchasePaymentSchema = z.object({
  refNo: z.string(),
  date: z.date(),
  customerCode: z.string(),
  currencyCode: z.string(),
  exchangeRate: z.number(),
  paymentMethod: z.string(),
  withholdingTaxRate: z.number(),
  withholdingTaxAmount: z.number(),
  totalBeforeTax: z.number(),
  totalAmount: z.number(),
  memo: z.string().optional().nullable(),
  purchasePaymentDetails: purchasePaymentDetailSchema.array(),
});

export const purchasePaymentRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.purchasePayment.findMany({
      where: { orgCode: ctx.user.orgCode, deletedAt: null },
      include: {},
      orderBy: {
        createdAt: "desc",
      },
    });

    return { data };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.purchasePayment.findUnique({
      where: {
        docNo_orgCode: {
          docNo: input,
          orgCode: ctx.user.orgCode,
        },
      },
      include: {
        purchasePaymentDetails: true,
        customer: true,
      },
    });

    return { data };
  }),

  create: protectedProcedure
    .input(purchasePaymentSchema)
    .mutation(async ({ input, ctx }) => {
      const purchasePaymentDetails = input.purchasePaymentDetails.filter(
        (i) => i.amount > 0
      );

      if (purchasePaymentDetails.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please enter payment amount",
        });
      }

      const docNo = generateDocNo("SP-");

      const data = await prisma.$transaction(async (prisma) => {
        const data = await prisma.purchasePayment.create({
          data: {
            docNo: docNo,
            ...input,
            purchasePaymentDetails: {
              createMany: {
                data: purchasePaymentDetails.map((item) => ({
                  purchaseInvoiceDocNo: item.purchaseInvoiceDocNo,
                  amount: item.amount,
                })),
              },
            },
            orgCode: ctx.user.orgCode,
            createdBy: ctx.user.username,
            updatedBy: ctx.user.username,
          },
        });
      });
      const updatedInvoiceNos = purchasePaymentDetails.map(
        (i) => i.purchaseInvoiceDocNo
      );

      await updatepurchaseInvoicesStatus(
        prisma,
        updatedInvoiceNos,
        ctx.user.orgCode
      );

      return { data };
    }),
  update: protectedProcedure
    .input(
      z.object({
        docNo: z.string(),
        fields: purchasePaymentSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { docNo, fields } = input;
      const { purchasePaymentItems, purchasePaymentServices, ...updatedField } =
        fields;

      const data = await prisma.$transaction(async (prisma) => {
        await prisma.purchasePaymentItem.deleteMany({
          where: {
            docNo: docNo,
            orgCode: ctx.user.orgCode,
          },
        });

        await prisma.purchasePaymentItem.createMany({
          data: purchasePaymentItems.map((item) => ({
            docNo: docNo,
            ...item,
          })) as any,
        });

        await prisma.purchasePaymentService.deleteMany({
          where: {
            docNo: docNo,
            orgCode: ctx.user.orgCode,
          },
        });

        await prisma.purchasePaymentItem.createMany({
          data: purchasePaymentServices.map((item) => ({
            docNo: docNo,
            ...item,
          })) as any,
        });

        return await prisma.purchasePayment.update({
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

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const result = await prisma.$transaction(async (prisma) => {
        const data = await prisma.purchasePayment.update({
          where: {
            docNo_orgCode: {
              docNo: input,
              orgCode: ctx.user.orgCode,
            },
          },
          data: {
            deletedAt: new Date(),
            updatedBy: ctx.user.username,
          },
        });

        const paymentDetails = await prisma.purchasePaymentDetail.findMany({
          where: {
            purchasePayment: { docNo: input, orgCode: ctx.user.orgCode },
          },
        });
        const updatedInvoices = paymentDetails.map(
          (i) => i.purchaseInvoiceDocNo
        );

        await updatepurchaseInvoicesStatus(
          prisma,
          updatedInvoices,
          ctx.user.orgCode
        );

        return data;
      });

      return { data: result };
    }),
});

export const updatepurchaseInvoicesStatus = async (
  prisma: Prisma.TransactionClient,
  purchaseInvoiceDocNos: string[],
  orgCode: string
) => {
  const purchaseInvoiceUpdatesPromises = purchaseInvoiceDocNos.map(
    async (purchaseInvoiceDocNo) => {
      const purchaseInvoicePayments =
        await prisma.purchasePaymentDetail.aggregate({
          where: {
            orgCode: orgCode,
            purchaseInvoiceDocNo: purchaseInvoiceDocNo,
            purchasePayment: { deletedAt: null },
          },
          _sum: { amount: true },
        });

      const purchaseInvoice = await prisma.purchaseInvoice.findUnique({
        where: {
          docNo_orgCode: {
            docNo: purchaseInvoiceDocNo,
            orgCode: orgCode,
          },
        },
      });

      if (!purchaseInvoice) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "purchase Invoice not found",
        });
      }

      const paidAmount = purchaseInvoicePayments._sum.amount || 0;
      const unpaidAmount = purchaseInvoice.totalAmount - paidAmount;
      let status: purchaseInvoiceStatus = "Open";
      if (unpaidAmount === 0) {
        status = "Paid";
      }
      if (paidAmount > 0 && paidAmount < purchaseInvoice.totalAmount) {
        status = "Partial";
      }

      return await prisma.purchaseInvoice.update({
        data: {
          paidAmount,
          unpaidAmount,
          status,
        },
        where: {
          docNo_orgCode: {
            orgCode: orgCode,
            docNo: purchaseInvoiceDocNo,
          },
        },
      });
    }
  );

  await Promise.all(purchaseInvoiceUpdatesPromises);
};
