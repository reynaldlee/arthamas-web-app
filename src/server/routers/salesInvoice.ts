import { protectedProcedure, router } from "./../trpc";
import { customerSchema } from "./customer";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { generateDocNo } from "../../utils/docNo";
import { serviceSchema } from "./service";
import { packagingSchema } from "./packaging";
import { productSchema } from "src/server/routers/product";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { currencySchema } from "./currency";

export const salesInvoiceItemSchema = z.object({
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

export const salesInvoiceServiceSchema = z.object({
  serviceCode: serviceSchema.shape.serviceCode,
  unitPrice: z.number(),
  amount: z.number(),
  desc: z.string().nullable().optional(),
});

export const salesInvoiceSchema = z.object({
  customerCode: z.string(),
  currencyCode: z.string(),
  date: z.date(),
  dueDate: z.date(),
  salesDeliveryDocNo: z.string(),
  exchangeRate: z.number(),
  bankAccountCode: z.string(),
  totalProduct: z.number(),
  totalService: z.number(),
  taxAmount: z.number(),
  taxRate: z.number(),
  taxCode: z.string(),
  withholdingTaxRate: z.number(),
  withholdingTaxAmount: z.number(),
  totalBeforeTax: z.number(),
  totalAmount: z.number(),
  memo: z.string().optional().nullable(),
  salesInvoiceItems: z.array(salesInvoiceItemSchema).optional().default([]),
  salesInvoiceServices: z
    .array(salesInvoiceServiceSchema)
    .optional()
    .default([]),
});

const findAllSalesInvoiceSchema = z
  .object({
    filters: z
      .object({
        currencyCode: currencySchema.shape.currencyCode.optional().nullable(),
        customerCode: customerSchema.shape.customerCode.optional().nullable(),
      })
      .optional(),
  })
  .optional();

export const salesInvoiceRouter = router({
  findAll: protectedProcedure
    .input(findAllSalesInvoiceSchema)
    .query(async ({ input, ctx }) => {
      const where: Prisma.SalesInvoiceWhereInput = {
        orgCode: ctx.user.orgCode,
      };

      if (input?.filters?.currencyCode) {
        where.currencyCode = input.filters.currencyCode;
      }

      if (input?.filters?.customerCode) {
        where.customerCode = input.filters.customerCode;
      }

      const data = await prisma.salesInvoice.findMany({
        where: where,
        include: {
          salesDelivery: true,
          salesOrder: true,
          customer: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return { data };
    }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.salesInvoice.findUnique({
      where: {
        docNo_orgCode: {
          docNo: input,
          orgCode: ctx.user.orgCode,
        },
      },
      include: {
        salesOrder: {
          include: {
            vessel: true,
          },
        },
        customer: true,
        salesDelivery: true,
        salesInvoiceItems: {
          include: {
            product: true,
            packaging: true,
          },
        },
        salesInvoiceServices: {
          include: {
            service: true,
          },
        },
      },
    });

    return { data };
  }),

  create: protectedProcedure
    .input(salesInvoiceSchema)
    .mutation(async ({ input, ctx }) => {
      const { salesInvoiceItems, salesInvoiceServices, ...salesInvoice } =
        input;
      const docNo = generateDocNo("INV-");

      const salesDelivery = await prisma.salesDelivery.findUnique({
        where: {
          docNo_orgCode: {
            docNo: input.salesDeliveryDocNo,
            orgCode: ctx.user.orgCode,
          },
        },
        include: {
          salesOrder: true,
        },
      });

      if (!salesDelivery) {
        throw new TRPCError({
          message: "Sales Delivery tidak ditemukan",
          code: "BAD_REQUEST",
        });
      }
      const { salesOrder } = salesDelivery;

      const data = await prisma.$transaction(async (prisma) => {
        await prisma.salesDelivery.update({
          data: {
            status: "Completed",
          },
          where: {
            docNo_orgCode: {
              docNo: salesDelivery.docNo,
              orgCode: salesDelivery.orgCode,
            },
          },
        });

        return await prisma.salesInvoice
          .create({
            data: {
              docNo: docNo,
              ...salesInvoice,
              date: input.date,
              paidAmount: 0,
              unpaidAmount: input.totalAmount,
              salesDeliveryDocNo: input.salesDeliveryDocNo,
              salesOrderDocNo: salesDelivery.salesOrderDocNo,
              dueDate: input.dueDate,
              status: "Open",
              orgCode: ctx.user.orgCode,
              bankAccount: {
                connect: {
                  bankAccountCode_orgCode: {
                    bankAccountCode: salesInvoice.bankAccountCode,
                    orgCode: ctx.user.orgCode,
                  },
                },
              },
              salesInvoiceItems: {
                createMany: {
                  data: salesInvoiceItems,
                },
              },
              salesInvoiceServices: {
                createMany: {
                  data: salesInvoiceServices,
                },
              },
              createdBy: ctx.user.username,
              updatedBy: ctx.user.username,
            },
          })
          .catch((error) => {
            console.log(error);
          });
      });

      return { data };
    }),

  update: protectedProcedure
    .input(
      z.object({
        docNo: z.string(),
        fields: salesInvoiceSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { docNo, fields } = input;
      const { salesInvoiceItems, salesInvoiceServices, ...updatedField } =
        fields;

      const salesInvoice = await prisma.salesInvoice.findUnique({
        where: {
          docNo_orgCode: { docNo: input.docNo, orgCode: ctx.user.orgCode },
        },
        select: { status: true },
      });

      if (salesInvoice?.status === "Paid") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Cannot edit this invoice. This invoice has been fully paid.",
        });
      }

      const data = await prisma.$transaction(async (prisma) => {
        await prisma.salesInvoiceItem.deleteMany({
          where: {
            docNo: docNo,
            orgCode: ctx.user.orgCode,
          },
        });

        await prisma.salesInvoiceItem.createMany({
          data: salesInvoiceItems.map((item) => ({
            docNo: docNo,
            orgCode: ctx.user.orgCode,
            ...item,
          })) as any,
        });

        await prisma.salesInvoiceService.deleteMany({
          where: {
            docNo: docNo,
            orgCode: ctx.user.orgCode,
          },
        });

        await prisma.salesInvoiceItem.createMany({
          data: salesInvoiceServices.map((item) => ({
            docNo: docNo,
            ...item,
          })) as any,
        });

        const salesInvoice = await prisma.salesInvoice.findUnique({
          where: {
            docNo_orgCode: { docNo: docNo, orgCode: ctx.user.orgCode },
          },
          select: { paidAmount: true },
        });

        return await prisma.salesInvoice.update({
          data: {
            ...updatedField,
            unpaidAmount: updatedField.totalAmount - salesInvoice?.paidAmount!,
          },
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

  cancel: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const result = await prisma.$transaction(async (prisma) => {
        await prisma.salesDelivery.updateMany({
          data: {
            status: "Open",
          },
          where: {
            salesInvoice: {
              docNo: input,
              orgCode: ctx.user.orgCode,
            },
          },
        });

        const data = await prisma.salesInvoice.update({
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
    }),
});

// async function updateSalesQuoteStatus(
//   prisma: Prisma.TransactionClient,
//   salesQuote: { orgCode: string; docNo: string }
// ) {
//   const countSO = await prisma.salesInvoice.count({
//     where: {
//       salesQuoteDocNo: salesQuote.docNo,
//       orgCode: salesQuote.orgCode,
//     },
//   });

//   await prisma.salesQuote.update({
//     data: {
//       status: countSO > 0 ? "Completed" : "Open",
//     },
//     where: {
//       docNo_orgCode: salesQuote,
//     },
//   });
// }
