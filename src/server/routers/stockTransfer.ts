import { Prisma } from "@prisma/client";
import { generateDocNo } from "../../utils/docNo";
import { format } from "date-fns";
import { serviceSchema } from "./service";
import { packagingSchema } from "./packaging";
import { productSchema } from "src/server/routers/product";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

// const a: Prisma.stockTransferServiceCreateManystockTransferInput;

export const stockTransferItemSchema = z.object({
  lineNo: z.number().min(1),
  productCode: productSchema.shape.productCode,
  packagingCode: packagingSchema.shape.packagingCode,
  qty: z.number(),
  unitCode: z.string(),
  unitQty: z.number(),
  totalUnitQty: z.number(),
});

export const stockTransferSchema = z.object({
  date: z.date(),
  fromWarehouseCode: z.string(),
  toWarehouseCode: z.string(),
  notes: z.string(),
  driverName: z.string(),
  truckCode: z.string(),
  stockTransferItems: z.array(stockTransferItemSchema).optional().default([]),
});

export const stockTransferRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.stockTransfer.findMany({
        where: { orgCode: ctx.user.orgCode },
        include: {
          warehouseFrom: true,
          warehouseTo: true,
          truck: true,
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
      const data = await prisma.stockTransfer.findUnique({
        where: {
          docNo_orgCode: {
            docNo: input,
            orgCode: ctx.user.orgCode,
          },
        },
        include: {
          stockTransferItems: {
            include: {
              product: true,
              productPackaging: true,
            },
          },
          truck: true,
          warehouseFrom: true,
          warehouseTo: true,
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: stockTransferSchema,
    resolve: async ({ input, ctx }) => {
      const { stockTransferItems, ...stockTransfer } = input;
      const docNo = generateDocNo("WH-");

      const data = await prisma.stockTransfer.create({
        data: {
          docNo: docNo,
          ...stockTransfer,
          status: "Open",
          orgCode: ctx.user.orgCode,

          stockTransferItems: {
            createMany: {
              data: stockTransferItems,
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
      fields: stockTransferSchema,
    }),
    resolve: async ({ input, ctx }) => {
      const { docNo, fields } = input;
      const { stockTransferItems, ...updatedField } = fields;

      const data = await prisma.$transaction(async (prisma) => {
        await prisma.stockTransferItem.deleteMany({
          where: {
            docNo: docNo,
            orgCode: ctx.user.orgCode,
          },
        });

        await prisma.stockTransferItem.createMany({
          data: stockTransferItems.map((item) => ({
            docNo: docNo,
            orgCode: ctx.user.orgCode,
            ...item,
          })) as any,
        });

        return await prisma.stockTransfer.update({
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
      const data = await prisma.stockTransfer.update({
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
    },
  });
