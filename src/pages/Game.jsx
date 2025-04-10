import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Address, Plaintext } from "@provablehq/sdk";
import { useGameState } from "../components/GameState";
import { Button } from "antd";
import "./Game.css";
// import GameHistory from "../components/GameHistory"
// import PlayerStats from "../components/PlayerStats";

const Homepage = () => {
    // Make sure this program ID exactly matches your deployed program.
    const deployedProgramId = "rockpaperscissors_game_v0_1_1.aleo";
    const { publicKey, wallet, requestTransactionHistory } = useWallet();

    const [currentGame, setCurrentGame] = useState(null);

    const {
        txStatus,
        setTxStatus,
        transactionId,
        setTransactionId,
        games,
        setGames,
        stats,
        networkClient,
        bhp,
        formatGame,
        gamesPlayed,
    } = useGameState();

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
                312751,             // Fee amount
                false            // Fee is public (false)
            );

            console.log("Transaction built:", tx);
            setTxStatus("Sending transaction...");

            // Execute the transaction using the wallet adapter.
            const txId = await wallet.adapter.requestTransaction(tx);
            console.log("Transaction executed:", txId);
            setTransactionId(txId);
            setTxStatus(`Transaction sent: ${txId}`);

            let adapterTxStatus = "";
            while (adapterTxStatus !== "Finalized") {
                console.log(adapterTxStatus);
                adapterTxStatus = await wallet?.adapter.transactionStatus(txId);
                await new Promise(r => setTimeout(r, 5000));
            }

            const addressPlaintextBits = Address.from_string(publicKey).toPlaintext().toBitsLe();
            const addressHash = bhp.hash(addressPlaintextBits);

            let gameIndex = await gamesPlayed();

            console.log(gameIndex)

            const gameStruct = `{
                player_hash: ${addressHash.toString()},
                game_index: ${gameIndex}u64
            }`;

            console.log("STRUCT - ", gameStruct)
    
            let pt = Plaintext.fromString(gameStruct);
            let bits = pt.toBitsLe();
            let hash = bhp.hash(bits);
            console.log(hash)
            console.log(hash.toString())

            let retries = 5;
            let latestGame;
            while (retries >= 0 && !latestGame) {
                try {
                    latestGame = await networkClient.getProgramMappingPlaintext("rockpaperscissors_game_v0_1_1.aleo", "history", hash);
                    setCurrentGame(formatGame(latestGame.toObject()));
                } catch (e) {
                    console.log("ERROR:", e);
                }
                await new Promise(r => setTimeout(r, 5000));
            }

            
        } catch (error) {
            console.error("Error executing transaction:", error);
            setTxStatus("Transaction failed");
        }
    };
    return (
        <div className="game">
            <Link to="https://provable.com/">
                <img
                    src="../public/provable-logo-light.svg"
                    className="logo"
                ></img>
            </Link>
            <div className="headerContainer">
                <h1 className="header">Rock Paper Scissors</h1>
                <p className="subheader">
                    Learn to query program mappings using a simple game.
                </p>{" "}
                    <div style={{ textAlign: "center" }}>
                        <h3>Select your move:</h3>
                        <div className="buttonRow">
                            <Button className="button" onClick={() => playGame(0)}>Rock</Button>
                            <Button className="button" onClick={() => playGame(1)}>Paper</Button>
                            <Button className="button" onClick={() => playGame(2)}>Scissors</Button>
                        </div>
                        {txStatus && <p>Status: {txStatus}</p>}
                        {transactionId && <p>Transaction ID: {transactionId}</p>}
                        {currentGame && <p>Player: {currentGame.playerMove} - System: {currentGame.systemMove} -- {currentGame.outcome}</p>}
                        <br/>
                    </div>
            </div>
        </div>
    )

}

export default Homepage;