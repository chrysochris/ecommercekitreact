import { createTheme, ThemeProvider } from "@mui/material/styles";
import DemoPage from "./demo/DemoPage.jsx";

const demoTheme = createTheme({
  palette: {
    primary: {
      main: "#20201d",
    },
    error: {
      main: "#c24155",
    },
    text: {
      primary: "#20201d",
      secondary: "#67675f",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Manrope", "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    button: {
      fontWeight: 800,
      textTransform: "none",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={demoTheme}>
      <DemoPage />
    </ThemeProvider>
  );
}

export default App;
