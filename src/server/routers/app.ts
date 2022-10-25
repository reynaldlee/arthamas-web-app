import { purchaseReceiptRouter } from "./purchaseReceipt";
import { purchaseOrderRouter } from "./purchaseOrder";
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
import superjson from "superjson";
import { supplierRouter } from "./supplier";
import { warehouseRouter } from "./warehouse";
import { truckRouter } from "./truck";
import { vesselRouter } from "./vessel";
import { userRouter } from "./users";
import { customerGroupRouter } from "./customerGroup";
import { createRouter } from "../createRouter";
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

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  .transformer(superjson)
  .query("healthz", {
    async resolve() {
      return "yay!";
    },
  })
  .merge("auth.", authRouter)
  .merge("area.", areaRouter)
  .merge("bankAccount.", bankAccountRouter)
  .merge("customer.", customerRouter)
  .merge("customerGroup.", customerGroupRouter)
  .merge("currency.", currencyRouter)
  .merge("inventory.", inventoryRouter)
  .merge("goodsReleaseOrder.", goodsReleaseOrderRouter)
  .merge("org.", orgRouter)
  .merge("port.", portRouter)
  .merge("product.", productRouter)
  .merge("productType.", productTypeRouter)
  .merge("productCategory.", productCategoryRouter)
  .merge("productGrade.", productGradeRouter)
  .merge("supplier.", supplierRouter)
  .merge("salesQuote.", salesQuoteRouter)
  .merge("salesOrder.", salesOrderRouter)
  .merge("salesDelivery.", salesDeliveryRouter)
  .merge("salesInvoice.", salesInvoiceRouter)
  .merge("salesPayment.", salesPaymentRouter)
  .merge("unit.", unitRouter)
  .merge("user.", userRouter)
  .merge("role.", roleRouter)
  .merge("profile.", profileRouter)
  .merge("purchaseOrder.", purchaseOrderRouter)
  .merge("purchaseReceipt.", purchaseReceiptRouter)
  .merge("service.", serviceRouter)
  .merge("stockTransfer.", stockTransferRouter)
  .merge("truck.", truckRouter)
  .merge("tax.", taxRouter)
  .merge("vessel.", vesselRouter)
  .merge("warehouse.", warehouseRouter);

export type AppRouter = typeof appRouter;
