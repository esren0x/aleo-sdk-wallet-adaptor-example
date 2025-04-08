import React, { createContext, useContext, useState } from "react";

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
    const [gameState, setGameState] = useState({
        adapterTxStatus: "",
        txStatus: "",
        transactionId: "",
        games: [],
        numGames: 0,
    });

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

    const setNumGames = (newNumGames) => {
        setGameState(prevState => ({
            ...prevState,
            numGames: newNumGames,
        }))
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
            }}
        >
            {children}
        </DataContext.Provider>
    )
}