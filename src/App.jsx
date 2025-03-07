import React from "react";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import LatestBlockHeight from "./components/LatestBlockHeight"; 
import LatestBalance from "./components/LatestBalance";
import RockpaperScissors from "./components/RockPaperScissors";
import Records from "./components/Records";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useRecords,
  useSelect,
  WalletProvider,
} from "aleo-hooks";

function App() {
  const { publicKey, connected, disconnect, network, wallet } = useWallet();
  const account = useAccount();

  return (
    <div className="App">
      <h1>Aleo Wallet Example</h1>
      <WalletMultiButton />
      {connected ? (
        <div>
          <h3>✅ Connected Wallet</h3>
          <p><strong>Wallet Address:</strong> {publicKey}</p>
          <p><strong>Connected Network:</strong> {network || "Unknown"}</p>
          <button onClick={disconnect}>Disconnect</button>
          <LatestBalance userAddress={publicKey} />
          {/* <LatestBlockHeight /> */}
          {/* Pass the wallet to the RockpaperScissors component */}
          <RockpaperScissors wallet={wallet} publicKey={publicKey} />
          <Records wallet={wallet} publicKey={publicKey} account={account} />
        </div>
      ) : (
        <p>🔴 Select a wallet to connect.</p>
      )}
    </div>
  );
}

export default App;
