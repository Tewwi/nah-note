/* eslint-disable @typescript-eslint/no-explicit-any */
// Update the Button's color prop options
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
    purple: true;
    mint: true;
  }
}
declare module "@mui/material" {
  interface Color {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    1000: string;
    1100: string;
    A100: string;
    A200: string;
    A400: string;
    A700: string;
  }
}

declare module "@mui/material/styles" {
  interface Color {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    1000: string;
    1100: string;
    A100: string;
    A200: string;
    A400: string;
    A700: string;
  }

  interface PaletteColor {
    lighter: string;
    light: string;
    main: string;
    dark: string;
    darker: string;
    contrastText: string;
  }

  interface Palette {
    neutral: Palette["primary"];
    purple: Palette["primary"];
    mint: Palette["primary"];
    gradients: any;
    chart: any;
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
    purple?: PaletteOptions["primary"];
    mint?: PaletteOptions["primary"];
  }
}

export {}; // 👈️ if you don't have anything else to export
