import * as React from "react";
import { ThemeProvider } from "@mui/material";

import { PureLightTheme } from "./schemes/PureLightTheme";

const ThemeProviderWrapper = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  return <ThemeProvider theme={PureLightTheme}>{children}</ThemeProvider>;
};

export default ThemeProviderWrapper;
