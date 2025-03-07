import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import {
  PuzzleWalletAdapter,
  // LeoWalletAdapter,
  FoxWalletAdapter,
  SoterWalletAdapter,
  // configureConnectionForPuzzle,
} from "aleo-adapters";
import {
  DecryptPermission,
  WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";

import App from "./App";
import "./index.css"; // Ensure this exists

// Default styles (required for modal UI)
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

const WalletWrapper = () => {
  // Initialize wallets inside a functional component using useMemo.
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: "Leo Demo App",
      }),
      new PuzzleWalletAdapter({
        programIdPermissions: {
          ["AleoMainnet"]: [
            "rockpaperscissors_game.aleo",
          ],
          ["AleoTestnet"]: [
            "rockpaperscissors_game.aleo",
          ],
        },
        appName: "Rock Paper Scissors",
        appDescription: "A simple game of rock paper scissors",
      }),
      // You can uncomment or add additional adapters here if needed:
      // new FoxWalletAdapter({ appName: "Aleo app" }),
      // new SoterWalletAdapter({ appName: "Aleo app" }),
    ],
    []
  );

  return (
    <WalletProvider
      wallets={wallets}
      decryptPermission={DecryptPermission.UponRequest}
      network={WalletAdapterNetwork.TestnetBeta} // Change to 'MainnetBeta' or 'TestnetBeta' if needed
      autoConnect
    >
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WalletWrapper />
  </React.StrictMode>
);
