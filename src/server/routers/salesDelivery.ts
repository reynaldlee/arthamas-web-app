import { Prisma } from "@prisma/client";
import { generateDocNo } from "../../utils/docNo";
import { format } from "date-fns";
import { serviceSchema } from "./service";
import { packagingSchema } from "./packaging";
import { productSchema } from "src/server/routers/product";
import { prisma } from "@/prisma/index";
import { z } from "zod";
import { createProtectedRouter } from "../createRouter";

// const a: Prisma.SalesQuoteServiceCreateManySalesQuoteInput;

export const salesDeliveryItemSchema = z.object({
  lineNo: z.number().min(1),
  productCode: z.number(),
  packagingCode: z.number(),
  desc: z.string().optional(),
  qty: z.number(),
});

export const salesDeliverySchema = z.object({
  goodsReleaseOrderDocNo: z.string(),
  date: z.date(),
  deliveryDate: z.date(),
  truckCode: z.string(),
  driverName: z.string(),
  salesDeliveryItems: z.string(),
});

export const salesDeliveryRouter = createProtectedRouter()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      const data = await prisma.salesDelivery.findMany({
        where: { orgCode: ctx.user.orgCode },
        include: {
          salesOrder: {
            include: {
              customer: true,
              port: true,
              vessel: true,
            },
          },
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
      const data = await prisma.salesDelivery.findUnique({
        where: {
          docNo_orgCode: {
            docNo: input,
            orgCode: ctx.user.orgCode,
          },
        },
        include: {
          truck: true,
          salesDeliveryItems: true,
          salesOrder: {
            include: {
              customer: true,
              port: true,
              vessel: true,
            },
          },
        },
      });
      return { data };
    },
  })
  .mutation("create", {
    input: salesDeliverySchema,
    resolve: async ({ input, ctx }) => {
      const { salesDeliveryItems, ...salesDelivery } = input;
      const docNo = generateDocNo("SQ-");

      const data = await prisma.salesDelivery.create({
        data: {
          docNo: docNo,
          ...salesDelivery,
          status: "Open",
          orgCode: ctx.user.orgCode,
          salesDeliveryItems: {
            createMany: {
              data: input.salesDeliveryItems,
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
      fields: salesDeliverySchema,
    }),
    resolve: async ({ input, ctx }) => {
      const { docNo, fields } = input;
      const { salesDeliveryItems, ...updatedField } = fields;

      const data = await prisma.$transaction(async (prisma) => {
        await prisma.salesDeliveryItem.deleteMany({
          where: {
            docNo: docNo,
            orgCode: ctx.user.orgCode,
          },
        });

        await prisma.salesDeliveryItem.createMany({
          data: salesDeliveryItems.map((item) => ({
            docNo: docNo,
            orgCode: ctx.user.orgCode,
            ...item,
          })) as any,
        });

        return await prisma.salesDelivery.update({
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
      const data = await prisma.salesDelivery.update({
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
