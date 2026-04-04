import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App";
import { createAppTheme } from "./theme";

const MODE_STORAGE_KEY = "infora-ui-mode";

function Root() {
  const [mode, setMode] = useState(
    () => localStorage.getItem(MODE_STORAGE_KEY) || "light",
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const toggleMode = () => {
    const nextMode = mode === "light" ? "dark" : "light";
    setMode(nextMode);
    localStorage.setItem(MODE_STORAGE_KEY, nextMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App mode={mode} onToggleMode={toggleMode} />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
