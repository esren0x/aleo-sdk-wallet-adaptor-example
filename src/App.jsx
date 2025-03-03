import React, { useEffect } from "react";
import { useConnect, useDisconnect, useSelect, useAccount } from "aleo-hooks";

function App() {
  const { connect, connectors = [], update } = useConnect() || {}; // ✅ Add `update()`
  const { disconnect } = useDisconnect() || {};
  const { select } = useSelect() || {};
  const { account } = useAccount() || {};

  // ✅ Debug: Force wallet update
  useEffect(() => {
    console.log("🔍 Initial Connectors:", connectors);
    if (update) {
      console.log("🔄 Forcing wallet update...");
      update(); // Force a wallet refresh
    }
  }, [connectors, update]);

  return (
    <div className="App">
      <h1>Aleo Wallet Example</h1>

      {account ? (
        <div>
          <p>Connected to: {account?.publicKey}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <div>
          <p>Select a wallet to connect:</p>
          {connectors.length > 0 ? (
            connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => select(connector.id)}
                disabled={connector.readyState === "NotDetected"}
              >
                Connect with {connector.id} ({connector.readyState})
              </button>
            ))
          ) : (
            <p>🔴 No wallets available (forcing update...)</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
