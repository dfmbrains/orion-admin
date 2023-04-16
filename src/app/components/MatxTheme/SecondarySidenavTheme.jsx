import { ThemeProvider } from "@mui/material";
import React from "react";

const SecondarySidenavTheme = ({ theme, children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
export default SecondarySidenavTheme;
