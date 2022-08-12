import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { createRouter } from "../../../server/createRouter";
import { appRouter } from "../../../server/routers/app";

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => {
    return {
      user: "",
    };
  },
});
