import { JwtPayload } from "./../types/user.types";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import * as jwt from "jsonwebtoken";
import nookies from "nookies";

// The app's context - is generated for each incoming request
export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers

  // This is just an example of something you'd might want to do in your ctx fn
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      // get token from authoriztion header
      try {
        const user = jwt.verify(
          req.headers.authorization.split(" ")[1],
          process.env.JWT_SECRET!
        ) as JwtPayload;
        return user;
      } catch (error) {
        console.log(error);
      }
    }

    const cookies = nookies.get({ req });

    if (cookies.session) {
      try {
        const user = jwt.verify(
          cookies.session,
          process.env.JWT_SECRET!
        ) as JwtPayload;
        return user;
      } catch (error: any) {
        return null;
      }
      // get token from session cookies
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
