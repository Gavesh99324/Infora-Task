import { createTheme } from "@mui/material/styles";

export function createAppTheme(mode = "light") {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#0B5FFF",
      },
      secondary: {
        main: "#0EA5A3",
      },
      background: {
        default: isDark ? "#0B1324" : "#F4F8FF",
        paper: isDark ? "#111A2E" : "#FFFFFF",
      },
      text: {
        primary: isDark ? "#E7ECF6" : "#0D1B2A",
        secondary: isDark ? "#A6B4CC" : "#334155",
      },
    },
    shape: {
      borderRadius: 18,
    },
    typography: {
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      h3: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      body1: {
        lineHeight: 1.65,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: isDark
              ? "0 14px 34px rgba(0, 0, 0, 0.35)"
              : "0 14px 34px rgba(11, 95, 255, 0.10)",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });
}
