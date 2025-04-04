import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { WalletWrapper } from "./components/WalletWrapper";
import "./index.css"; // Ensure this exists

// Default styles (required for modal UI)
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

const Main = () => {
  return <WalletWrapper>
    <App></App>
  </WalletWrapper>
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
