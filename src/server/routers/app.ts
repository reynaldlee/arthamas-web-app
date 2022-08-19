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
  .merge("customer.", customerRouter)
  .merge("customerGroup.", customerGroupRouter)
  .merge("org.", orgRouter)
  .merge("port.", portRouter)
  .merge("supplier.", supplierRouter)
  .merge("user.", userRouter)
  .merge("truck.", truckRouter)
  .merge("vessel.", vesselRouter)
  .merge("warehouse.", warehouseRouter);

export type AppRouter = typeof appRouter;
