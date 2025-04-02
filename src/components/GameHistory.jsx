import React, { useEffect, useState } from 'react';
import {
    Transaction,
    WalletAdapterNetwork,
    WalletNotConnectedError,
} from "@demox-labs/aleo-wallet-adapter-base";
import { BHP256, initThreadPool } from '@provablehq/sdk';
import { Address } from '@provablehq/sdk/mainnet.js';

const GameHistory = ({ wallet, publicKey }) => {
    initThreadPool().then(() => {});

    const [games, setGames] = useState([]);
    // const bhp = new BHP256();
    // const addressPlaintextBits = new Address(publicKey);
    console.log("HELP: ", addressPlaintextBits);

    // const fetchGame = (gameIndex) => {
    //     const gameStruct = 
    // }

    // useEffect(() => {

    // })

    return (
        <div>
            {publicKey && <h4>Game History for {publicKey}:</h4>}
        </div>
    )
};

export default GameHistory;