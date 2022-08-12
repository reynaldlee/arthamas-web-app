import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/declarations/src/adapters/node-http";
import { IncomingMessage } from "http";
import ws from "ws";
import * as jwt from "jsonwebtoken";

// The app's context - is generated for each incoming request
export async function createContext({
  req,
  res,
}:
  | trpcNext.CreateNextContextOptions
  | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers

  // This is just an example of something you'd might want to do in your ctx fn
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const user = await jwt.decode(req.headers.authorization.split(" ")[1]);
      return user;
    }
    return null;
  }
  const user = await getUserFromHeader();

  return {
    req,
    res,
    user,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
