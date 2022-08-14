import type { AppType } from "next/dist/shared/lib/utils";

import { withTRPC } from "@trpc/next";
import { AppRouter } from "./api/trpc/[trpc]";
import superjson from "superjson";
import ThemeProviderWrapper from "src/theme/ThemeProvider";
import { OrgProvider } from "src/context/OrganizationContext";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProviderWrapper>
      <OrgProvider>
        <Component {...pageProps} />
      </OrgProvider>
    </ThemeProviderWrapper>
  );
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    return {
      url: `${process.env.NEXT_PUBLIC_HOST}/api/trpc`,
      transformer: superjson,
    };
  },
  // ssr: true,
})(MyApp);
