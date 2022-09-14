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
  .merge("customer.", customerRouter)
  .merge("customerGroup.", customerGroupRouter)
  .merge("currency.", currencyRouter)
  .merge("org.", orgRouter)
  .merge("port.", portRouter)
  .merge("product.", productRouter)
  .merge("productType.", productTypeRouter)
  .merge("productCategory.", productCategoryRouter)
  .merge("productGrade.", productGradeRouter)
  .merge("supplier.", supplierRouter)
  .merge("salesQuote.", salesQuoteRouter)
  .merge("salesOrder.", salesOrderRouter)
  .merge("unit.", unitRouter)
  .merge("user.", userRouter)
  .merge("profile.", profileRouter)
  .merge("service.", serviceRouter)
  .merge("truck.", truckRouter)
  .merge("tax.", taxRouter)
  .merge("vessel.", vesselRouter)
  .merge("warehouse.", warehouseRouter);

export type AppRouter = typeof appRouter;
