import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import WebApp from "@twa-dev/sdk";
import Web3AuthProvider from "./contexts/Web3AuthProvider.tsx";
import SignProtocolProvider from "./contexts/SignProtocolProvider.tsx";
import LitProtocolProvider from "./contexts/LitProtocolProvider.tsx";

WebApp.ready();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Web3AuthProvider>
      <SignProtocolProvider>
        <LitProtocolProvider>
          <App />
        </LitProtocolProvider>
      </SignProtocolProvider>
    </Web3AuthProvider>
  </StrictMode>
);
