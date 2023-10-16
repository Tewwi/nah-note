/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prefer-const */
import { CssBaseline } from "@mui/material";
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material/styles";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { componentsOverride } from "./componentsOverride";
import { paletteLight, paletteDark } from "./palette";
import { typography } from "./typography";
import { shadowsDarkMode, shadowsLightMode } from "./shadow";
import { breakpoints } from "./breakpoints";
import { useTranslation } from "react-i18next";

interface Context {
  theme: string;
  setTheme: (theme: string) => void;
  language: string;
}

interface Props {
  children: React.ReactNode;
}

const ThemeContext = createContext<Context>({
  theme: "",
  setTheme: () => {},
  language: "",
});

export const ThemeConfig = (props: Props) => {
  const { children } = props;
  const [themeMode, setThemeMode] = useState("light");
  const [language, setLanguage] = useState("en");
  const { i18n } = useTranslation();

  const themeOptions = useMemo(
    () => ({
      palette: themeMode === "dark" ? paletteDark : paletteLight,
      typography,
      shadows: themeMode === "dark" ? shadowsDarkMode : shadowsLightMode,
      breakpoints,
    }),
    [themeMode]
  );

  const handleSetTheme = (theme: string) => {
    setThemeMode(theme);
    localStorage.setItem("themeMode", theme);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setThemeMode(localStorage.getItem("themeMode") || "light");
      setLanguage(localStorage.getItem("lng") || "en");
      void i18n.changeLanguage(localStorage.getItem("lng") || "en");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <ThemeContext.Provider
      value={{ theme: themeMode, setTheme: handleSetTheme, language: language }}
    >
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
