import React, { useEffect, useState } from 'react';
import {
    Transaction,
    WalletAdapterNetwork,
    WalletNotConnectedError,
} from "@demox-labs/aleo-wallet-adapter-base";
import {
    Address,
    AleoNetworkClient,
    BHP256,
    initThreadPool,
} from '@provablehq/sdk';

const GameHistory = ({ wallet, publicKey }) => {
    initThreadPool().then(() => {});
    const networkClient = new AleoNetworkClient("https://api.explorer.provable.com/v1");

    const [games, setGames] = useState([]);
    const bhp = new BHP256();
    const addressPlaintextBits = Address.from_string(publicKey).toPlaintext().toBitsLe();
    const addressHash = bhp.hash(addressPlaintextBits);
    console.log("HELP: ", addressHash.toString());

    let gamesPlayed = async () => {
        // parseInt((await networkClient.getProgramMappingValue("rockpaperscissors_game_v0_1_1.aleo", "game_count", addressHash.toString())).replace("u64", ""));
        let numGames = await networkClient.getProgramMappingValue("rockpaperscissors_game_v0_1_1.aleo", "game_count", addressHash.toString()) ?? "0u64";
        return parseInt(numGames.replace("u64", ""));
    };

    const fetchGame = (gameIndex) => {
        const gameStruct = `{
            player_hash: ${addressHash.toString()},
            game_index: ${gameIndex}
        }`
        console.log(gameStruct)
    };

    useEffect(() => {
        let games = gamesPlayed().then((res) => console.log("NUM GAMES: ", res));
        fetchGame(0);
    }, []);

    return (
        <div>
            {publicKey && <h4>Game History for {publicKey}:</h4>}
        </div>
    )
};

export default GameHistory;