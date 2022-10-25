import { useRouter } from "next/router";
import { Context } from "./context";
import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { router } from "./trpc";

/**
 * Helper function to create a router with context
 */

export function createRouter() {
  return trpc.router<Context>();
}

export function createProtectedRouter() {
  return trpc.router<Context>().middleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  });
}
