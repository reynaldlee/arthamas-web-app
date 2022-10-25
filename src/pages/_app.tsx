import type { AppType } from "next/dist/shared/lib/utils";

import { withTRPC } from "@trpc/next";

import superjson from "superjson";
import ThemeProviderWrapper from "src/theme/ThemeProvider";
import { AuthProvider } from "src/context/AuthContext";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { id } from "date-fns/locale";
import { AppRouter } from "src/server/routers/app";
import { trpc } from "@/utils/trpc";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProviderWrapper>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
          <Component {...pageProps} />
        </LocalizationProvider>
      </AuthProvider>
    </ThemeProviderWrapper>
  );
};

export default trpc.withTRPC(MyApp);
