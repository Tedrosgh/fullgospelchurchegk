import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#343348", dark: "#252638", contrastText: "#ffffff" },
    secondary: { main: "#087f8c", dark: "#075f69", contrastText: "#ffffff" },
    warning: { main: "#d7a44a", light: "#ffd166", contrastText: "#242536" },
    background: { default: "#f5f3ef", paper: "#fffdf9" },
    text: { primary: "#292a3e", secondary: "#686777" },
    divider: "rgba(42,43,62,.13)",
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 900, letterSpacing: "-.04em" },
    h2: { fontWeight: 900, letterSpacing: "-.035em" },
    h3: { fontWeight: 850, letterSpacing: "-.025em" },
    button: { fontWeight: 800, letterSpacing: ".01em", textTransform: "none" },
    overline: { fontWeight: 800, letterSpacing: ".15em" },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: 2, paddingInline: 20 } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiCard: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
  },
});

export const editorialGradient = "linear-gradient(125deg, #292a3e 0%, #41394a 58%, #76565b 120%)";
export const editorialShadow = "0 22px 58px rgba(34,35,53,.18)";

export default theme;
