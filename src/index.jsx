import { StyledEngineProvider } from "@mui/styled-engine";
import { SnackbarProvider } from "notistack";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <BrowserRouter>
      <SnackbarProvider anchorOrigin={{ horizontal: "right", vertical: "top" }}>
        <App />
      </SnackbarProvider>
    </BrowserRouter>
  </StyledEngineProvider>,
  document.getElementById("root")
);
