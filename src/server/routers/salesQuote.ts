import { Prisma } from "@prisma/client";
import { generateDocNo } from "./../../utils/docNo";
import { format } from "date-fns";
import { serviceSchema } from "./service";
import { packagingSchema } from "./packaging";
import { productSchema } from "src/server/routers/product";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

// const a: Prisma.SalesQuoteServiceCreateManySalesQuoteInput;

export const salesQuoteItemSchema = z.object({
  lineNo: z.number().min(1),
  productCode: productSchema.shape.productCode,
  packagingCode: packagingSchema.shape.packagingCode,
  desc: z.string().optional(),
  qty: z.number().transform((value) => new Prisma.Decimal(value)),
  unitCode: z.string(),
  unitQty: z.number(),
  totalUnitQty: z.number(),
  unitPrice: z.number(),
  amount: z.number(),
});

export const salesQuoteServiceSchema = z.object({
  serviceCode: serviceSchema.shape.serviceCode,
  unitPrice: z.number(),
  amount: z.number(),
  desc: z.string().nullable().optional(),
});

export const salesQuoteSchema = z.object({
  customerCode: z.string(),
  currencyCode: z.string(),
  portCode: z.string(),
  date: z.string(),
  validUntil: z.string(),
  vesselCode: z.string(),
  exchangeRate: z.number(),
  warehouseCode: z.string(),
  shipTo: z.string(),
  totalProduct: z.number(),
  totalService: z.number(),
  taxAmount: z.number(),
  taxRate: z.number(),
  taxCode: z.string(),
  totalBeforeTax: z.number(),
  totalAmount: z.number(),
  memo: z.string().optional().nullable(),
  salesQuoteItems: z.array(salesQuoteItemSchema).optional().default([]),
  salesQuoteServices: z.array(salesQuoteServiceSchema).optional().default([]),
});

export const salesQuoteRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.salesQuote.findMany({
        where: { orgCode: ctx.user.orgCode },
        include: {
          customer: { select: { name: true } },
          vessel: { select: { name: true } },
        },
      });

      return { data };
    },
  })
  .query("find", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const data = await prisma.salesQuote.findUnique({
        where: {
          docNo_orgCode: {
            docNo: input,
            orgCode: ctx.user.orgCode,
          },
        },
        include: {
          salesQuoteItems: true,
          salesQuoteServices: true,
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: salesQuoteSchema,
    resolve: async ({ input, ctx }) => {
      const { salesQuoteItems, salesQuoteServices, ...salesQuote } = input;
      const docNo = generateDocNo("SQ-");

      console.log(input);

      const data = await prisma.salesQuote.create({
        data: {
          docNo: docNo,
          ...salesQuote,
          date: new Date(input.date),
          validUntil: new Date(input.validUntil),
          status: "Open",
          orgCode: ctx.user.orgCode,
          salesQuoteItems: {
            createMany: {
              data: salesQuoteItems as any,
            },
          },
          salesQuoteServices: {
            createMany: {
              data: salesQuoteServices as any,
            },
          },
          createdBy: ctx.user.username,
          updatedBy: ctx.user.username,
        },
      });

      return { data };
    },
  })
  .mutation("update", {
    input: z.object({
      docNo: z.string(),
      fields: salesQuoteSchema,
    }),
    resolve: async ({ input, ctx }) => {
      const { docNo, fields } = input;
      const { salesQuoteItems, salesQuoteServices, ...updatedField } = fields;

      const data = await prisma.$transaction(async (prisma) => {
        await prisma.salesQuoteItem.deleteMany({
          where: {
            docNo: docNo,
          },
        });

        await prisma.salesQuoteItem.createMany({
          data: salesQuoteItems.map((item) => ({
            docNo: docNo,
            ...item,
          })) as any,
        });

        await prisma.salesQuoteService.deleteMany({
          where: {
            docNo: docNo,
          },
        });

        await prisma.salesQuoteItem.createMany({
          data: salesQuoteServices.map((item) => ({
            docNo: docNo,
            ...item,
          })) as any,
        });

        return await prisma.salesQuote.update({
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
// .mutation("delete", {
//   input: z.string(),
//   resolve: async ({ input, ctx }) => {
//     const data = await prisma.product.delete({
//       where: {
//         productCode_orgCode: {
//           productCode: input,
//           orgCode: ctx.user.orgCode,
//         },
//       },
//     });

//     return { data };
//   },
// });
