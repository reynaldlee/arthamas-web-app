import { publicProcedure, router } from "../trpc";

import { roleRouter } from "./role";
import { salesOrderRouter } from "./salesOrder";
import { taxRouter } from "./tax";
import { serviceRouter } from "./service";
import { currencyRouter } from "./currency";
import { salesQuoteRouter } from "./salesQuote";
import { productTypeRouter } from "./productType";
import { productGradeRouter } from "./productGrade";
import { productCategoryRouter } from "./productCategory";
import { profileRouter } from "./profile";
import { areaRouter } from "./area";
import { unitRouter } from "./unit";
import { productRouter } from "./product";
import { supplierRouter } from "./supplier";
import { warehouseRouter } from "./warehouse";
import { truckRouter } from "./truck";
import { vesselRouter } from "./vessel";
import { userRouter } from "./users";
import { customerGroupRouter } from "./customerGroup";
import { authRouter } from "./auth";
import { portRouter } from "./port";
import { orgRouter } from "./org";
import { customerRouter } from "./customer";
import { goodsReleaseOrderRouter } from "./goodsRelease";
import { salesDeliveryRouter } from "./salesDelivery";
import { salesInvoiceRouter } from "./salesInvoice";
import { salesPaymentRouter } from "./salesPayment";
import { bankAccountRouter } from "./bankAccount";
import { inventoryRouter } from "./inventory";
import { stockTransferRouter } from "./stockTransfer";

import { purchaseOrderRouter } from "./purchaseOrder";
import { purchaseReceiptRouter } from "./purchaseReceipt";
import { purchaseInvoiceRouter } from "./purchaseInvoice";

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = router({
  healthz: publicProcedure.query(() => {
    return "yay!";
  }),
  auth: authRouter,
  area: areaRouter,
  bankAccount: bankAccountRouter,
  customer: customerRouter,
  customerGroup: customerGroupRouter,
  currency: currencyRouter,
  inventory: inventoryRouter,
  goodsReleaseOrder: goodsReleaseOrderRouter,
  org: orgRouter,
  port: portRouter,
  product: productRouter,
  productType: productTypeRouter,
  productCategory: productCategoryRouter,
  productGrade: productGradeRouter,
  supplier: supplierRouter,
  salesQuote: salesQuoteRouter,
  salesOrder: salesOrderRouter,
  salesDelivery: salesDeliveryRouter,
  salesInvoice: salesInvoiceRouter,
  salesPayment: salesPaymentRouter,
  unit: unitRouter,
  user: userRouter,
  role: roleRouter,
  profile: profileRouter,
  purchaseOrder: purchaseOrderRouter,
  purchaseInvoice: purchaseInvoiceRouter,
  purchaseReceipt: purchaseReceiptRouter,
  service: serviceRouter,
  stockTransfer: stockTransferRouter,
  truck: truckRouter,
  tax: taxRouter,
  vessel: vesselRouter,
  warehouse: warehouseRouter,
});

export type AppRouter = typeof appRouter;
