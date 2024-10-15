import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    error: {
      main: "#f44336",
    },
    text: {
      primary: "#ffffff",
      secondary: "#bdbdbd",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    allVariants: {
      color: "#ffffff",
    },
  },
});

export default darkTheme;
