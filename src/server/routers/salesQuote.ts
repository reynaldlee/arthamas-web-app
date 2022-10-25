import { protectedProcedure } from "./../trpc";
import { TRPCError } from "@trpc/server";

import { generateDocNo } from "./../../utils/docNo";

import { serviceSchema } from "./service";
import { packagingSchema } from "./packaging";
import { productSchema } from "src/server/routers/product";
import { prisma } from "@/prisma/index";
import { z } from "zod";

import { router } from "../trpc";

// const a: Prisma.SalesQuoteServiceCreateManySalesQuoteInput;

export const salesQuoteItemSchema = z.object({
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
  date: z.date(),
  validUntil: z.date(),
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

export const salesQuoteRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.salesQuote.findMany({
      where: { orgCode: ctx.user.orgCode },
      include: {
        customer: { select: { name: true } },
        vessel: { select: { name: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { data };
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
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
  }),

  create: protectedProcedure
    .input(salesQuoteSchema)
    .mutation(async ({ input, ctx }) => {
      const { salesQuoteItems, salesQuoteServices, ...salesQuote } = input;
      const docNo = generateDocNo("SQ-");

      const data = await prisma.salesQuote.create({
        data: {
          docNo: docNo,
          ...salesQuote,
          date: input.date,
          validUntil: input.validUntil,
          status: "Open",
          orgCode: ctx.user.orgCode,
          taxRate: input.taxRate,
          salesQuoteItems: {
            createMany: {
              data: salesQuoteItems,
            },
          },
          salesQuoteServices: {
            createMany: {
              data: salesQuoteServices,
            },
          },
          createdBy: ctx.user.username,
          updatedBy: ctx.user.username,
        },
      });

      return { data };
    }),

  update: protectedProcedure
    .input(
      z.object({
        docNo: z.string(),
        fields: salesQuoteSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { docNo, fields } = input;
      const { salesQuoteItems, salesQuoteServices, ...updatedField } = fields;

      const salesQuoteData = await prisma.salesQuote.findUnique({
        where: {
          docNo_orgCode: {
            docNo: docNo,
            orgCode: ctx.user.orgCode,
          },
        },
        select: { status: true },
      });

      if (!salesQuoteData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Sales quote ${docNo} not found`,
        });
      }

      if (salesQuoteData.status !== "Open") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Sales quote ${docNo} has been "${salesQuoteData.status}". You can no longer edit this quotation`,
        });
      }

      const data = await prisma.$transaction(async (prisma) => {
        await prisma.salesQuoteItem.deleteMany({
          where: {
            docNo: docNo,
            orgCode: ctx.user.orgCode,
          },
        });

        await prisma.salesQuoteItem.createMany({
          data: salesQuoteItems.map((item) => ({
            docNo: docNo,
            orgCode: ctx.user.orgCode,
            ...item,
          })) as any,
        });

        await prisma.salesQuoteService.deleteMany({
          where: {
            docNo: docNo,
            orgCode: ctx.user.orgCode,
          },
        });

        await prisma.salesQuoteService.createMany({
          data: salesQuoteServices.map((item) => ({
            docNo: docNo,
            orgCode: ctx.user.orgCode,
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
    }),

  cancel: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.salesQuote.update({
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
