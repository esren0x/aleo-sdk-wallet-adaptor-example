import React, { useState } from "react";
import {
  Transaction,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from "@demox-labs/aleo-wallet-adapter-base";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useRecords,
  useSelect,
  WalletProvider,
} from "aleo-hooks";


const Records = ({ wallet, publicKey, account }) => {
  // Make sure this program ID exactly matches your deployed program.
  const deployedProgramId = "rockpaperscissors_game.aleo";
  
  const { requestRecords, records } = useRecords();
  

  return (
    <div>
      {account?.publicKey && (
        <button onClick={() => requestRecords()}>Request Records</button>
      )}

      {records?.map((record) => (
        <div key={record.id}>{record.id}</div>
      ))}
    </div>
  );
};

export default Records;

