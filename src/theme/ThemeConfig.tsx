/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prefer-const */
import { CssBaseline } from "@mui/material";
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material/styles";
import React, { useEffect, useMemo, useState } from "react";
import { componentsOverride } from "./componentsOverride";
import { paletteLight, paletteDark } from "./palette";
import { typography } from "./typography";
import { shadows } from "./shadow";
import { breakpoints } from "./breakpoints";

interface Props {
  children: React.ReactNode;
}

export const ThemeConfig = (props: Props) => {
  const { children } = props;
  const [themeMode, setThemeMode] = useState("white");

  const themeOptions = useMemo(
    () => ({
      palette: themeMode === "dark" ? paletteDark : paletteLight,
      typography,
      shadows,
      breakpoints,
    }),
    [themeMode]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setThemeMode(localStorage.getItem("themeMode") || "white");
    }
  }, []);

  let theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
