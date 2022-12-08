import { protectedProcedure } from "./../trpc";
import { TRPCError } from "@trpc/server";

import { generateDocNo } from "../../utils/docNo";
import { prisma } from "@/prisma/index";
import { z } from "zod";

import { router } from "../trpc";
import { Prisma, SalesInvoiceStatus } from "@prisma/client";

export const salesPaymentDetailSchema = z.object({
  salesInvoiceDocNo: z.string(),
  amount: z.number(),
});

export const salesPaymentSchema = z.object({
  refNo: z.string(),
  date: z.date(),
  customerCode: z.string(),
  currencyCode: z.string(),
  exchangeRate: z.number(),
  // taxAmount: z.number(),
  // taxRate: z.number(),
  paymentMethod: z.string(),
  withholdingTaxRate: z.number(),
  withholdingTaxAmount: z.number(),
  totalBeforeTax: z.number(),
  totalAmount: z.number(),
  memo: z.string().optional().nullable(),
  salesPaymentDetails: salesPaymentDetailSchema.array(),
});

export const salesPaymentRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.salesPayment.findMany({
      where: { orgCode: ctx.user.orgCode, deletedAt: null },
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { data };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.salesPayment.findUnique({
      where: {
        docNo_orgCode: {
          docNo: input,
          orgCode: ctx.user.orgCode,
        },
      },
      include: {
        salesPaymentDetails: true,
        customer: true,
      },
    });

    return { data };
  }),

  create: protectedProcedure
    .input(salesPaymentSchema)
    .mutation(async ({ input, ctx }) => {
      const salesPaymentDetails = input.salesPaymentDetails.filter(
        (i) => i.amount > 0
      );

      if (salesPaymentDetails.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please enter payment amount",
        });
      }

      const docNo = generateDocNo("SP-");

      const data = await prisma.$transaction(async (prisma) => {
        const data = await prisma.salesPayment.create({
          data: {
            docNo: docNo,
            ...input,
            salesPaymentDetails: {
              createMany: {
                data: salesPaymentDetails.map((item) => ({
                  salesInvoiceDocNo: item.salesInvoiceDocNo,
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
      const updatedInvoiceNos = salesPaymentDetails.map(
        (i) => i.salesInvoiceDocNo
      );

      await updateSalesInvoicesStatus(
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
        fields: salesPaymentSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { docNo, fields } = input;
      const { salesPaymentItems, salesPaymentServices, ...updatedField } =
        fields;

      const data = await prisma.$transaction(async (prisma) => {
        await prisma.salesPaymentItem.deleteMany({
          where: {
            docNo: docNo,
            orgCode: ctx.user.orgCode,
          },
        });

        await prisma.salesPaymentItem.createMany({
          data: salesPaymentItems.map((item) => ({
            docNo: docNo,
            ...item,
          })) as any,
        });

        await prisma.salesPaymentService.deleteMany({
          where: {
            docNo: docNo,
            orgCode: ctx.user.orgCode,
          },
        });

        await prisma.salesPaymentItem.createMany({
          data: salesPaymentServices.map((item) => ({
            docNo: docNo,
            ...item,
          })) as any,
        });

        return await prisma.salesPayment.update({
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
        const data = await prisma.salesPayment.update({
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

        const paymentDetails = await prisma.salesPaymentDetail.findMany({
          where: {
            salesPayment: { docNo: input, orgCode: ctx.user.orgCode },
          },
        });
        const updatedInvoices = paymentDetails.map((i) => i.salesInvoiceDocNo);

        await updateSalesInvoicesStatus(
          prisma,
          updatedInvoices,
          ctx.user.orgCode
        );

        return data;
      });

      return { data: result };
    }),
});

export const updateSalesInvoicesStatus = async (
  prisma: Prisma.TransactionClient,
  salesInvoiceDocNos: string[],
  orgCode: string
) => {
  const salesInvoiceUpdatesPromises = salesInvoiceDocNos.map(
    async (salesInvoiceDocNo) => {
      const salesInvoicePayments = await prisma.salesPaymentDetail.aggregate({
        where: {
          orgCode: orgCode,
          salesInvoiceDocNo: salesInvoiceDocNo,
          salesPayment: { deletedAt: null },
        },
        _sum: { amount: true },
      });

      const salesInvoice = await prisma.salesInvoice.findUnique({
        where: {
          docNo_orgCode: {
            docNo: salesInvoiceDocNo,
            orgCode: orgCode,
          },
        },
      });

      if (!salesInvoice) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sales Invoice not found",
        });
      }

      const paidAmount = salesInvoicePayments._sum.amount || 0;
      const unpaidAmount = salesInvoice.totalAmount - paidAmount;
      let status: SalesInvoiceStatus = "Open";
      if (unpaidAmount === 0) {
        status = "Paid";
      }
      if (paidAmount > 0 && paidAmount < salesInvoice.totalAmount) {
        status = "Partial";
      }

      return await prisma.salesInvoice.update({
        data: {
          paidAmount,
          unpaidAmount,
          status,
        },
        where: {
          docNo_orgCode: {
            orgCode: orgCode,
            docNo: salesInvoiceDocNo,
          },
        },
      });
    }
  );

  await Promise.all(salesInvoiceUpdatesPromises);
};
