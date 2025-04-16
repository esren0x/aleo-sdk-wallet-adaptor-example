import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Address, Plaintext } from "@provablehq/sdk";
import { useGameState } from "../components/GameState";
import { Button, Progress, Typography } from "antd";
import "./Game.css";

const Game = () => {
    // Make sure this program ID exactly matches your deployed program.
    const deployedProgramId = "rockpaperscissors_game_v0_1_1.aleo";
    const { publicKey, wallet } = useWallet();

    const [currentGame, setCurrentGame] = useState(null);
    const [gameLoading, setGameLoading] = useState(false);
    const [loadingPercent, setLoadingPercent] = useState(0);

    const {
        txStatus,
        setTxStatus,
        setTransactionId,
        setNumGames,
        networkClient,
        bhp,
        formatGame,
        gamesPlayed,
    } = useGameState();

    const incrementLoad = async (oldValue, newValue, ms = 100) => {
        for (let i = oldValue; i <= newValue; i++) {
            await new Promise(r => setTimeout(r, ms))
            setLoadingPercent(i);
        }
    }


    const playGame = async (move) => {
        try {
            if (!publicKey) throw new WalletNotConnectedError();
            let gameIndex = await gamesPlayed();
            setGameLoading(true);
            setTxStatus("Building Transaction...");

            // Prepare input. If the SDK expects a number instead of a string,
            // you might try: const inputs = [move]; instead of [`${move}u8`]
            const inputs = [`${move}u8`];

            await incrementLoad(0, 10);
            setTxStatus("Building Transaction...");

            // Build the transaction using the helper.
            const tx = Transaction.createTransaction(
                publicKey,                          // Caller’s address
                WalletAdapterNetwork.TestnetBeta,   // Chain ID (make sure it matches what the network expects)
                deployedProgramId,                  // Program ID exactly as deployed
                "play",                             // Function name to call
                inputs,                             // Array of input strings
                212751,                             // Fee amount
                false                               // Fee is public (false)
            );

            console.log("Transaction built:", tx);

            await incrementLoad(10, 20);
            setTxStatus("Broadcasting Transaction...");

            // Execute the transaction using the wallet adapter.
            const txId = await wallet.adapter.requestTransaction(tx);
            console.log("Transaction executed:", txId);
            setTransactionId(txId);
            setTxStatus("Transaction Sent");

            let adapterTxStatus = "";
            await incrementLoad(20, 40, 150);
            let retries = 10;
            let confirmed = false;
            while (retries >= 0 && adapterTxStatus !== "Finalized") {
                adapterTxStatus = await wallet?.adapter.transactionStatus(txId);
                if ((adapterTxStatus === "Completed" || adapterTxStatus === "Pending") && !confirmed) {
                    confirmed = true;
                    setTxStatus("Transaction Confirmed...");
                    await new Promise(r => setTimeout(r, 1000));
                    setTxStatus("Finalizing Transaction...");
                    await incrementLoad(40, 60, 1000);
                } else {
                    if (retries <= 0) {
                        setTxStatus("Polling Failed");
                        throw "Transaction exceeded maximum number of retires."
                    }
                    retries--;
                    await new Promise(r => setTimeout(r, 5000));
                }
            }
            setTxStatus("Transaction Finalized...");

            await incrementLoad(60, 80, 300);

            const addressPlaintextBits = Address.from_string(publicKey).toPlaintext().toBitsLe();
            const addressHash = bhp.hash(addressPlaintextBits);

            const gameStruct = `{
                player_hash: ${addressHash.toString()},
                game_index: ${gameIndex}u64
            }`;
    
            let pt = Plaintext.fromString(gameStruct);
            let bits = pt.toBitsLe();
            let hash = bhp.hash(bits);

            retries = 10;
            let latestGame;
            while (retries >= 0 && !latestGame) {
                try {
                    if (txStatus !== "Aggregating Game Stats...") {
                        setTxStatus("Aggregating Game Stats...");
                    }
                    await incrementLoad(100-retries-1, 100-retries);
                    latestGame = await networkClient.getProgramMappingPlaintext("rockpaperscissors_game_v0_1_1.aleo", "history", hash.toPlaintext());
                    await incrementLoad(100-retries, 100);
                    setTxStatus("Transaction Complete!");
                    setCurrentGame(formatGame(latestGame.toObject()));
                    setNumGames(gameIndex+1)
                } catch (e) {
                    if (retries <= 0) {
                        throw e;
                    }
                    console.log(e)
                    console.log(`Failed to fetch game, retrying... (${retries} attempts remaining)`);
                    retries--;
                    await new Promise(r => setTimeout(r, 2000));
                }
            }
            setGameLoading(false);
        } catch (error) {
            setGameLoading(false);
            console.error("Error executing transaction:", error);
            setTxStatus("Failed");
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
                    <div style={{ width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                        <div style={{ width: "1200px", textAlign: "center", marginTop: "20px" }}>
                            <h3>Select your move:</h3>
                            <div className="buttonRow">
                                <Button className="button" onClick={() => playGame(0)}>Rock</Button>
                                <Button className="button" onClick={() => playGame(1)}>Paper</Button>
                                <Button className="button" onClick={() => playGame(2)}>Scissors</Button>
                            </div>
                        </div>
                            <div className={`outcomeLoader fade ${gameLoading && loadingPercent < 100 ? 'visible' : 'hidden'}`}>
                                <Progress className="animate-pulse" percent={loadingPercent} percentPosition={{ align: 'center', type: 'inner' }} size={[400, 20]} strokeColor="#ec005a" />
                            </div> 
                            <Typography.Title level={5}>{txStatus}</Typography.Title>
                            {currentGame &&
                            <div className={`actionRow fade ${!gameLoading && loadingPercent >= 100 ? 'visible' : 'hidden'}`}>
                                    <div className="actionItem">You: {currentGame.playerMove}</div>
                                    <p className="actionItem">System: {currentGame.systemMove}</p>
                                    <p className="actionItem">{currentGame.outcome}</p>
                            </div>
                            }
                        <br/>
                    </div>
            </div>
        </div>
    )

}

export default Game;