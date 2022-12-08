import { protectedProcedure } from "./../trpc";
import { TRPCError } from "@trpc/server";
import { generateDocNo } from "../../utils/docNo";
import { prisma } from "@/prisma/index";
import { z } from "zod";

import { pick } from "lodash";
import { router } from "../trpc";

// const a: Prisma.SalesQuoteServiceCreateManySalesQuoteInput;

export const salesDeliveryItemDetailSchema = z.object({
  barcode: z.string(),
});

export const salesDeliveryItemSchema = z.object({
  lineNo: z.number().min(1),
  productCode: z.string(),
  packagingCode: z.string(),
  desc: z.string().optional(),
  qty: z.number(),
  salesOrderItemLineNo: z.number(),
});

export const salesDeliverySchema = z.object({
  goodsReleaseOrderDocNo: z.string(),
  date: z.date(),
  memo: z.string().optional().nullable(),
  deliveryDate: z.date(),
  truckCode: z.string(),
  driverName: z.string(),
  salesDeliveryItems: z.array(salesDeliveryItemSchema).min(1),
  salesDeliveryItemDetails: z
    .array(salesDeliveryItemDetailSchema)
    .optional()
    .nullable(),
});

export const salesDeliveryRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.salesDelivery.findMany({
      where: { orgCode: ctx.user.orgCode },
      include: {
        warehouse: true,
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
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await prisma.salesDelivery.findUnique({
      where: {
        docNo_orgCode: {
          docNo: input,
          orgCode: ctx.user.orgCode,
        },
      },
      include: {
        truck: true,
        salesDeliveryItems: {
          include: {
            salesOrderItem: {
              include: {
                product: true,
                packaging: true,
              },
            },
          },
        },
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
  }),

  findOpenStatus: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.salesDelivery.findMany({
      where: {
        orgCode: ctx.user.orgCode,
        status: "Open",
      },
      include: {
        warehouse: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { data };
  }),

  create: protectedProcedure
    .input(salesDeliverySchema)
    .mutation(async ({ input, ctx }) => {
      const { salesDeliveryItems, ...salesDelivery } = input;
      const docNo = generateDocNo("DN-");

      const goodsReleaseOrder = await prisma.goodsReleaseOrder.findFirst({
        where: {
          docNo: salesDelivery.goodsReleaseOrderDocNo,
          orgCode: ctx.user.orgCode,
        },
      });

      if (!goodsReleaseOrder) {
        throw new TRPCError({
          message: "SP2B tidak ditemukan",
          code: "BAD_REQUEST",
        });
      }

      const data = await prisma.$transaction(async (prisma) => {
        await prisma.goodsReleaseOrder.update({
          data: {
            status: "Completed",
          },
          where: {
            docNo_orgCode: {
              docNo: goodsReleaseOrder.docNo,
              orgCode: goodsReleaseOrder.orgCode,
            },
          },
        });

        const result = await prisma.salesDelivery.create({
          data: {
            docNo: docNo,
            ...pick(salesDelivery, ["deliveryDate", "date", "driverName"]),
            status: "Open",
            org: {
              connect: {
                orgCode: goodsReleaseOrder.orgCode,
              },
            },
            warehouse: {
              connect: {
                warehouseCode_orgCode: {
                  warehouseCode: goodsReleaseOrder.warehouseCode,
                  orgCode: goodsReleaseOrder.orgCode,
                },
              },
            },
            truck: {
              connect: {
                truckCode_orgCode: {
                  truckCode: salesDelivery.truckCode,
                  orgCode: goodsReleaseOrder.orgCode,
                },
              },
            },
            salesDeliveryItems: {
              createMany: {
                data: input.salesDeliveryItems.map((item) => ({
                  ...item,
                  salesOrderItemDocNo: goodsReleaseOrder.salesOrderDocNo,
                  salesOrderItemLineNo: item.salesOrderItemLineNo,
                })),
              },
            },
            goodsReleaseOrder: {
              connect: {
                docNo_orgCode: {
                  docNo: goodsReleaseOrder.docNo,
                  orgCode: goodsReleaseOrder.orgCode,
                },
              },
            },
            salesOrder: {
              connect: {
                docNo_orgCode: {
                  docNo: goodsReleaseOrder.salesOrderDocNo,
                  orgCode: goodsReleaseOrder.orgCode,
                },
              },
            },
            createdBy: ctx.user.username,
            updatedBy: ctx.user.username,
          },
        });
        return result;
      });

      return { data };
    }),

  update: protectedProcedure
    .input(
      z.object({
        docNo: z.string(),
        fields: salesDeliverySchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { docNo, fields } = input;
      const { salesDeliveryItems, ...updatedField } = fields;

      const salesDelivery = await prisma.salesDelivery.findFirst({
        where: {
          docNo: input.docNo,
        },
      });

      if (!salesDelivery) {
        throw new TRPCError({
          message: "Delivery not found",
          code: "BAD_REQUEST",
        });
      }

      if (input.fields.salesDeliveryItemDetails) {
        delete input.fields?.salesDeliveryItemDetails;
      }

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
            ...item,
            orgCode: ctx.user.orgCode,
            salesOrderItemDocNo: salesDelivery.salesOrderDocNo,
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
    }),
  cancel: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
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
    }),

  scanBarcode: protectedProcedure
    .input(
      z.object({
        barcode: z.string(),
        goodsReleaseOrderDocNo: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [productCode, packagingCode, batchNo] = input.barcode.split(" ");

      const checkScanned = await prisma.salesDeliveryItemDetail.findFirst({
        where: {
          barcode: input.barcode,
          goodsReleaseOrderDocNo: input.goodsReleaseOrderDocNo,
          orgCode: ctx.user.orgCode,
        },
      });

      if (checkScanned) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Product barcode sudah pernah di scan",
        });
      }

      const prod = await prisma.productPackaging.findFirst({
        where: {
          orgCode: ctx.user.orgCode,
          productCode: productCode,
          packagingCode: packagingCode,
        },
      });

      if (!prod) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Product Tidak ditemukan",
        });
      }

      await prisma.$transaction(async (prisma) => {
        await prisma.salesDeliveryItemDetail.create({
          data: {
            barcode: input.barcode,
            goodsReleaseOrderDocNo: input.goodsReleaseOrderDocNo,
            batchNo: batchNo,
            productCode: productCode,
            packagingCode: packagingCode,
            orgCode: ctx.user.orgCode,
            createdBy: ctx.user.username,
            updatedBy: ctx.user.username,
          },
        });
      });

      return { data: prod };
    }),

  getScannedProducts: protectedProcedure
    .input(
      z.object({
        goodsReleaseOrderDocNo: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const data = await prisma.salesDeliveryItemDetail.findMany({
        where: {
          orgCode: ctx.user.orgCode,
          goodsReleaseOrderDocNo: input.goodsReleaseOrderDocNo,
        },
      });

      return { data };
    }),

  deleteScannedProduct: protectedProcedure
    .input(
      z.object({
        barcode: z.string(),
        goodReleaseOrderDocNo: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = await prisma.salesDeliveryItemDetail.delete({
        where: {
          barcode_goodsReleaseOrderDocNo_orgCode: {
            barcode: input.barcode,
            goodsReleaseOrderDocNo: input.goodReleaseOrderDocNo,
            orgCode: ctx.user.orgCode,
          },
        },
      });

      return { data };
    }),
});
