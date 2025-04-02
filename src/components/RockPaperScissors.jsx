import React, { useState } from "react";
import {
  Transaction,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from "@demox-labs/aleo-wallet-adapter-base";
import GameHistory from "./GameHistory";

const RockpaperScissors = ({ wallet, publicKey }) => {
  // Make sure this program ID exactly matches your deployed program.
  const deployedProgramId = "rockpaperscissors_game_v0_1_1.aleo";

  const [txStatus, setTxStatus] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const playGame = async (move) => {
    try {
      if (!publicKey) throw new WalletNotConnectedError();
      setTxStatus("Building transaction...");

      // Prepare input. If the SDK expects a number instead of a string,
      // you might try: const inputs = [move]; instead of [`${move}u8`]
      const inputs = [`${move}u8`];

      // IMPORTANT: Double-check that the chain ID is correct.
      // For example, try "testnetbeta" exactly if that's what the network expects.
      const chainId = "testnet";

      // Build the transaction using the helper.
      const tx = Transaction.createTransaction(
        publicKey,       // Caller’s address
        WalletAdapterNetwork.TestnetBeta,         // Chain ID (make sure it matches what the network expects)
        deployedProgramId, // Program ID exactly as deployed
        "play",          // Function name to call
        inputs,          // Array of input strings
        212751,             // Fee amount
        false            // Fee is public (false)
      );

      console.log("Transaction built:", tx);
      setTxStatus("Sending transaction...");

      // Execute the transaction using the wallet adapter.
      const txId = await wallet.adapter.requestTransaction(tx);
      console.log("Transaction executed:", txId);
      setTransactionId(txId);
      setTxStatus(`Transaction sent: ${txId}`);
    } catch (error) {
      console.error("Error executing transaction:", error);
      setTxStatus("Transaction failed");
    }
  };

  return (
    <div>
      <h2>Rock Paper Scissors</h2>
      <p>Select your move:</p>
      <button onClick={() => playGame(0)}>Rock</button>
      <button onClick={() => playGame(1)}>Paper</button>
      <button onClick={() => playGame(2)}>Scissors</button>
      {txStatus && <p>Status: {txStatus}</p>}
      {transactionId && <p>Transaction ID: {transactionId}</p>}

      <br/>
      <GameHistory wallet={wallet} publicKey={publicKey} />
    </div>
  );
};

export default RockpaperScissors;

