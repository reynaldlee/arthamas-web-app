import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { generateDocNo } from "../../utils/docNo";
import { format } from "date-fns";
import { serviceSchema } from "./service";
import { packagingSchema } from "./packaging";
import { productSchema } from "src/server/routers/product";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const salesPaymentItemSchema = z.object({
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

export const salesPaymentServiceSchema = z.object({
  serviceCode: serviceSchema.shape.serviceCode,
  unitPrice: z.number(),
  amount: z.number(),
  desc: z.string().nullable().optional(),
});

export const salesPaymentSchema = z.object({
  refNo: z.string(),
  date: z.date(),
  dueDate: z.date(),
  currencyCode: z.string(),
  exchangeRate: z.number(),
  totalAmount: z.number(),
  memo: z.string().optional().nullable(),
});

export const salesPaymentRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.salesPayment.findMany({
        where: { orgCode: ctx.user.orgCode },
        include: {
          salesDelivery: true,
          salesOrder: true,
          customer: true,
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
      const data = await prisma.salesPayment.findUnique({
        where: {
          docNo_orgCode: {
            docNo: input,
            orgCode: ctx.user.orgCode,
          },
        },
        include: {
          salesOrder: true,
          customer: true,
          salesDelivery: true,
          salesPaymentItems: {
            include: {
              product: true,
              packaging: true,
            },
          },
          salesPaymentServices: {
            include: {
              service: true,
            },
          },
        },
      });

      return { data };
    },
  })
  .mutation("create", {
    input: salesPaymentSchema,
    resolve: async ({ input, ctx }) => {
      const { salesPaymentItems, salesPaymentServices, ...salesPayment } =
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

      const data = prisma.$transaction(async (prisma) => {
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

        return await prisma.salesPayment
          .create({
            data: {
              docNo: docNo,
              ...salesPayment,
              date: input.date,
              paidAmount: 0,
              currencyCode: salesOrder.currencyCode,
              customerCode: salesOrder.customerCode,
              exchangeRate: salesOrder.exchangeRate,
              unpaidAmount: input.totalAmount,
              salesDeliveryDocNo: input.salesDeliveryDocNo,
              salesOrderDocNo: salesDelivery.salesOrderDocNo,
              dueDate: input.dueDate,
              status: "Open",
              orgCode: ctx.user.orgCode,
              salesPaymentItems: {
                createMany: {
                  data: salesPaymentItems,
                },
              },
              salesPaymentServices: {
                createMany: {
                  data: salesPaymentServices,
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
    },
  })
  .mutation("update", {
    input: z.object({
      docNo: z.string(),
      fields: salesPaymentSchema,
    }),
    resolve: async ({ input, ctx }) => {
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
    },
  })
  .mutation("cancel", {
    input: z.string(),
    resolve: async ({ input, ctx }) => {
      const result = await prisma.$transaction(async (prisma) => {
        const data = await prisma.salesPayment.update({
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

// async function updateSalesQuoteStatus(
//   prisma: Prisma.TransactionClient,
//   salesQuote: { orgCode: string; docNo: string }
// ) {
//   const countSO = await prisma.salesPayment.count({
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
