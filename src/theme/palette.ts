/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Palette } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { grey, orange } from "./colors";

function createGradient(color1: string, color2: string) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

// SETUP COLORS
const GREY = {
  ...grey,
  500_8: alpha("#C1C8CD", 0.08),
  500_12: alpha("#C1C8CD", 0.12),
  500_16: alpha("#C1C8CD", 0.16),
  500_24: alpha("#C1C8CD", 0.24),
  500_32: alpha("#C1C8CD", 0.32),
  500_48: alpha("#C1C8CD", 0.48),
  500_56: alpha("#C1C8CD", 0.56),
  500_80: alpha("#C1C8CD", 0.8),
};

const PRIMARY = {
  lighter: "#EDF6FF",
  light: "#E1F0FF",
  main: "#0091FF",
  dark: "#0081F1",
  darker: "#006ADC",
  contrastText: "#FBFDFF",
};

const SECONDARY_LIGHT = {
  lighter: "#FFF1E7",
  light: "#FFB381",
  main: "#F76808",
  dark: "#ED5F00",
  darker: "#BD4B00",
  contrastText: "rgba(0, 0, 0, 0.2)",
};

const SECONDARY_DARK = {
  lighter: "#FFF1E7",
  light: "#FFB381",
  main: "#F76808",
  dark: "#ED5F00",
  darker: "#BD4B00",
  contrastText: "rgba(103, 92, 92, 0.6)",
};

const INFO = {
  lighter: "#EDF6FF",
  light: "#E1F0FF",
  main: "#0091FF",
  dark: "#0081F1",
  darker: "#006ADC",
  contrastText: "#FBFDFF",
};

const SUCCESS = {
  lighter: "#E9F9EE",
  light: "#5BB98C",
  main: "#30A46C",
  dark: "#299764",
  darker: "#18794E",
  contrastText: "#E9F9EE",
};

const WARNING = {
  lighter: "#FFF8BB",
  light: "#FFE16A",
  main: "#EBBC00",
  dark: "#F7CE00",
  darker: "#946800",
  contrastText: "#FFF8BB",
};

const ERROR = {
  lighter: "#FFEFEF",
  light: "#F3AEAF",
  main: "#E5484D",
  dark: "#DC3D43",
  darker: "#CD2B31",
  contrastText: "#FFEFEF",
};

const PURPLE = {
  lighter: "#F5F2FF",
  light: "#AA99EC",
  main: "#6E56CF",
  dark: "#644FC1",
  darker: "#5746AF",
  contrastText: "#F5F2FF",
};

const MINT = {
  lighter: "#E8F9F5",
  light: "#40C4AA",
  main: "#69D9C1",
  dark: "#36D7B4",
  darker: "#147D6F",
  contrastText: "#EAFBF6",
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main),
};

const CHART_COLORS = {
  violet: ["#826AF9", "#9E86FF", "#D0AEFF", "#F7D2FF"],
  blue: ["#2D99FF", "#83CFFF", "#A5F3FF", "#CCFAFF"],
  green: ["#2CD9C5", "#60F1C8", "#A4F7CC", "#C0F2DC"],
  yellow: ["#FFE700", "#FFEF5A", "#FFF7AE", "#FFF3D6"],
  red: ["#FF6C40", "#FF8F6D", "#FFBD98", "#FFF2D4"],
};

type IPalette = Omit<
  Palette,
  "getContrastText" | "augmentColor" | "contrastThreshold" | "tonalOffset"
>;

export const paletteLight: IPalette = {
  mode: "light",
  common: { black: "#000", white: "#fff" },
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY_LIGHT },
  info: { ...INFO },
  success: { ...SUCCESS },
  warning: { ...WARNING },
  error: { ...ERROR },
  purple: { ...PURPLE },
  neutral: { ...PURPLE },
  mint: { ...MINT },
  grey: GREY as any,
  gradients: GRADIENTS as any,
  chart: CHART_COLORS,
  divider: GREY[500_24],
  text: { primary: GREY[1100], secondary: GREY[1000], disabled: GREY[500] },
  background: {
    paper: orange[500],
    default: "#fff",
    neutral: GREY[100],
  } as any,
  action: {
    active: GREY[600],
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[200],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  } as any,
};

export const paletteDark: IPalette = {
  mode: "dark",
  common: { black: "#000", white: "#fff" },
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY_DARK },
  info: { ...INFO },
  success: { ...SUCCESS },
  warning: { ...WARNING },
  error: { ...ERROR },
  purple: { ...PURPLE },
  neutral: { ...PURPLE },
  mint: { ...MINT },
  grey: GREY as any,
  gradients: GRADIENTS as any,
  chart: CHART_COLORS,
  divider: GREY[500_24],
  text: { primary: GREY[50], secondary: GREY[300], disabled: GREY[500] },
  background: {
    paper: "#202020",
    default: "#101418",
    neutral: GREY[100],
  } as any,
  action: {
    active: GREY[600],
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  } as any,
};
