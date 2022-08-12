import type { AppType } from "next/dist/shared/lib/utils";
import type { FunctionComponent, ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

import { withTRPC } from "@trpc/next";
import { AppRouter } from "./api/trpc/[trpc]";
import superjson from "superjson";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    return {
      url: `${process.env.NEXT_PUBLIC_HOST}/api/trpc`,
      transformer: superjson,
    };
  },
  ssr: true,
})(MyApp);
