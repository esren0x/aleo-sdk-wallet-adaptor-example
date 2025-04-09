import React, { createContext, useContext, useEffect, useState } from "react";
import { Address, AleoNetworkClient, BHP256 } from "@provablehq/sdk";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";

// Create the context with a default value
const DataContext = createContext({});

// Custom hook to use the context
export const useGameState = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
};

// Define the data structure
export const GameState = ({ children }) => {

    const { connected, publicKey } = useWallet();

    const networkClient = new AleoNetworkClient("https://api.explorer.provable.com/v1");
    const bhp = new BHP256();

    const gamesPlayed = async () => {
        const addressPlaintextBits = Address.from_string(publicKey).toPlaintext().toBitsLe();
        const addressHash = bhp.hash(addressPlaintextBits);
        let numGames = await networkClient.getProgramMappingValue("rockpaperscissors_game_v0_1_1.aleo", "game_count", addressHash.toString()) ?? "0u64";
        return parseInt(numGames.replace("u64", ""));
    };

    const [gameState, setGameState] = useState({
        adapterTxStatus: "",
        txStatus: "",
        transactionId: "",
        games: [],
        numGames: 0,
    });

    const setNumGames = (newNumGames) => {
        setGameState(prevState => ({
            ...prevState,
            numGames: newNumGames,
        }))
    }

    useEffect(() => {
        gamesPlayed()
            .then(gameCount => setNumGames(gameCount))
    }, [connected])

    const setAdapterTxStatus = (newStatus) => {
        setGameState(prevState => ({
            ...prevState,
            adapterTxStatus: newStatus,
        }))
    }

    const setTxStatus = (newStatus) => {
        setGameState(prevState => ({
            ...prevState,
            txStatus: newStatus,
        }))
    }

    const setTransactionId = (newTransactionId) => {
        setGameState(prevState => ({
            ...prevState,
            transactionId: newTransactionId,
        }))
    }

    const setGames = (newGames) => {
        setGameState(prevState => ({
            ...prevState,
            games: newGames,
        }))
    }

    const formatGame = (game) => {
        const translateMove = (move) => {
            if (move === 0) {
                return '✊';
            } else if (move === 1) {
                return '✋';
            } else {
                return '✌️';
            }
        }

        const translateOutcome = (res) => {
            if (res === 0) {
                return "Draw";
            } else if (res === 1) {
                return "Player Wins";
            } else {
                return "Player Loses";
            }
        }
        
        let formatted = {
            playerMove: translateMove(game.player_move),
            systemMove: translateMove(game.system_move),
            outcome: translateOutcome(game.outcome),
        }

        if (game.key) {
            formatted.key = `${game.key}`;
            formatted.game = game.key;
        }

        return formatted;
    }

    return (
        <DataContext.Provider
            value={{
                adapterTxStatus: gameState.adapterTxStatus,
                setAdapterTxStatus,
                txStatus: gameState.txStatus,
                setTxStatus,
                transactionId: gameState.transactionId,
                setTransactionId,
                games: gameState.games,
                setGames,
                numGames: gameState.numGames,
                setNumGames,
                networkClient,
                bhp,
                formatGame,
                gamesPlayed,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}