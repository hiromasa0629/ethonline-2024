import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import WebApp from "@twa-dev/sdk";
import Web3AuthProvider from "./contexts/Web3AuthProvider.tsx";
import SignProtocolProvider from "./contexts/SignProtocolProvider.tsx";
import LitProtocolProvider from "./contexts/LitProtocolProvider.tsx";
import { XMTPProvider } from "@xmtp/react-sdk";

WebApp.ready();

createRoot(document.getElementById("root")!).render(
  <Web3AuthProvider>
    <SignProtocolProvider>
      <XMTPProvider>
        <LitProtocolProvider>
          <App />
        </LitProtocolProvider>
      </XMTPProvider>
    </SignProtocolProvider>
  </Web3AuthProvider>
);
