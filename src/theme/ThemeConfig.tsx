/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prefer-const */
import { CssBaseline } from "@mui/material";
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material/styles";
import React, { useMemo } from "react";
import { useGlobalContext } from "~/context/GlobalContext";
import { breakpoints } from "./breakpoints";
import { componentsOverride } from "./componentsOverride";
import { paletteDark, paletteLight } from "./palette";
import { shadowsDarkMode, shadowsLightMode } from "./shadow";
import { typography } from "./typography";

interface Props {
  children: React.ReactNode;
}

export const ThemeConfig = (props: Props) => {
  const { children } = props;
  const { theme: themeMode } = useGlobalContext();

  const themeOptions = useMemo(
    () => ({
      palette: themeMode === "dark" ? paletteDark : paletteLight,
      typography,
      shadows: themeMode === "dark" ? shadowsDarkMode : shadowsLightMode,
      breakpoints,
    }),
    [themeMode]
  );

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
