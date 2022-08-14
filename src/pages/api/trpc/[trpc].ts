import * as trpcNext from "@trpc/server/adapters/next";
import { Context, createContext } from "src/server/context";
import { appRouter } from "../../../server/routers/app";

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler<AppRouter>({
  router: appRouter,
  onError: ({ error, ctx }) => {
    if (error.code === "UNAUTHORIZED") {
    }
  },
  createContext: createContext,
});
