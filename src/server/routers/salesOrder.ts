import { Prisma } from "@prisma/client";
import { generateDocNo } from "../../utils/docNo";
import { format } from "date-fns";
import { serviceSchema } from "./service";
import { packagingSchema } from "./packaging";
import { productSchema } from "src/server/routers/product";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

export const salesOrderItemSchema = z.object({
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

export const salesOrderServiceSchema = z.object({
  serviceCode: serviceSchema.shape.serviceCode,
  unitPrice: z.number(),
  amount: z.number(),
  desc: z.string().nullable().optional(),
});

export const salesOrderSchema = z.object({
  customerCode: z.string(),
  currencyCode: z.string(),
  portCode: z.string(),
  date: z.string(),
  deliveryDate: z.string(),
  poNumber: z.string(),
  poDate: z.string(),
  poNotes: z.string(),
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
  salesOrderItems: z.array(salesOrderItemSchema).optional().default([]),
  salesOrderServices: z.array(salesOrderServiceSchema).optional().default([]),
});

export const salesOrderRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.salesOrder.findMany({
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
      const data = await prisma.salesOrder.findUnique({
        where: {
          docNo_orgCode: {
            docNo: input,
            orgCode: ctx.user.orgCode,
          },
        },
        include: {
          salesOrderItems: true,
          salesOrderServices: true,
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: salesOrderSchema,
    resolve: async ({ input, ctx }) => {
      const { salesOrderItems, salesOrderServices, ...salesOrder } = input;
      const docNo = generateDocNo("SO-");

      const data = await prisma.salesOrder.create({
        data: {
          docNo: docNo,
          ...salesOrder,
          isSKTD: false,
          date: new Date(input.date),
          deliveryDate: new Date(input.deliveryDate),
          poDate: new Date(input.poDate),
          status: "Open",
          orgCode: ctx.user.orgCode,
          salesOrderItems: {
            createMany: {
              data: salesOrderItems as any,
            },
          },
          salesOrderServices: {
            createMany: {
              data: salesOrderServices as any,
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
      fields: salesOrderSchema,
    }),
    resolve: async ({ input, ctx }) => {
      const { docNo, fields } = input;
      const { salesOrderItems, salesOrderServices, ...updatedField } = fields;

      const data = await prisma.$transaction(async (prisma) => {
        await prisma.salesOrderItem.deleteMany({
          where: {
            docNo: docNo,
          },
        });

        await prisma.salesOrderItem.createMany({
          data: salesOrderItems.map((item) => ({
            docNo: docNo,
            ...item,
          })) as any,
        });

        await prisma.salesOrderService.deleteMany({
          where: {
            docNo: docNo,
          },
        });

        await prisma.salesOrderItem.createMany({
          data: salesOrderServices.map((item) => ({
            docNo: docNo,
            ...item,
          })) as any,
        });

        return await prisma.salesOrder.update({
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
