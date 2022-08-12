import { createRouter } from "../createRouter";
import { orgRouter } from "./org";
import superjson from "superjson";
import { authRouter } from "./auth";

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
  .merge("org.", orgRouter);

export type AppRouter = typeof appRouter;
