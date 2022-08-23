import type { AppType } from "next/dist/shared/lib/utils";

import { withTRPC } from "@trpc/next";
import { AppRouter } from "./api/trpc/[trpc]";
import superjson from "superjson";
import ThemeProviderWrapper from "src/theme/ThemeProvider";
import { AuthProvider } from "src/context/AuthContext";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProviderWrapper>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProviderWrapper>
  );
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    return {
      url: `${process.env.NEXT_PUBLIC_HOST}/api/trpc`,
      transformer: superjson,
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 2,
            staleTime: 0,
            onError: (err: any) => {
              if (err.data.httpStatus === 401) {
                window.document.location = "/login";
              }
            },
          },
        },
      },
    };
  },
  // ssr: true,
})(MyApp);
