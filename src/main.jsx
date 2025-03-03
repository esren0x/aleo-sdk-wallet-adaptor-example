import React from "react";
import ReactDOM from "react-dom/client";
import { WalletProvider } from "aleo-hooks";
import {
  PuzzleWalletAdapter,
  LeoWalletAdapter,
  FoxWalletAdapter,
  SoterWalletAdapter,
} from "aleo-adapters";
import App from "./App";
import "./index.css";

// ✅ Ensure wallets are correctly initialized
const wallets = [
  new LeoWalletAdapter({ appName: "Aleo App" }),
  new PuzzleWalletAdapter({
    programIdPermissions: {
      mainnet: ["dApp_1.aleo", "dApp_1_import.aleo", "dApp_1_import_2.aleo"],
      testnet: ["dApp_1_test.aleo", "dApp_1_test_import.aleo", "dApp_1_test_import_2.aleo"],
    },
    appName: "Aleo App",
    appDescription: "A privacy-focused DeFi app",
    appIconUrl: "https://aleo.network/favicon.ico",
  }),
  new FoxWalletAdapter({ appName: "Aleo App" }),
  new SoterWalletAdapter({ appName: "Aleo App" }),
];

// ✅ Debug: Log before passing to WalletProvider
console.log("Passing wallets to WalletProvider:", wallets);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WalletProvider wallets={wallets} autoConnect={true}>
      <App />
    </WalletProvider>
  </React.StrictMode>
);
