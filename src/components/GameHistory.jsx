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
    Plaintext,
} from '@provablehq/sdk';

const GameHistory = ({ wallet, publicKey }) => {
    initThreadPool().then(() => {});
    const networkClient = new AleoNetworkClient("https://api.explorer.provable.com/v1");

    const [games, setGames] = useState([]);
    const [page, setPage] = useState(0);

    const bhp = new BHP256();
    const addressPlaintextBits = Address.from_string(publicKey).toPlaintext().toBitsLe();
    const addressHash = bhp.hash(addressPlaintextBits);

    const gamesPlayed = async () => {
        let numGames = await networkClient.getProgramMappingValue("rockpaperscissors_game_v0_1_1.aleo", "game_count", addressHash.toString()) ?? "0u64";
        return parseInt(numGames.replace("u64", ""));
    };

    const fetchGame = async (gameIndex) => {
        const gameStruct = `{
            player_hash: ${addressHash.toString()},
            game_index: ${gameIndex}u64
        }`;
        console.log(gameStruct)
        let pt = Plaintext.fromString(gameStruct);
        let bits = pt.toBitsLe();
        let hash = bhp.hash(bits);
        let game = await networkClient.getProgramMappingPlaintext("rockpaperscissors_game_v0_1_1.aleo", "history", hash);
        return game.toObject();
    };

    useEffect(() => {
        gamesPlayed().then((numGames) => {
            console.log(numGames)
            const start = page * 5;
            const end = start + 4;
            let gamesOnPage = [];
            for (let i = start; i <= end; i++) {
                fetchGame(i)
                    .then(game => {
                        gamesOnPage = games;
                        gamesOnPage.push(game);
                        setGames(gamesOnPage);
                        console.log(games)
                    });
            }
        });
    }, []);

    return (
        <div>
            {publicKey && <h4>Game History for {publicKey}:</h4>}
            <ul>
            {games.forEach(game => {
                <li>{game}</li>
            })}
            </ul>
        </div>
    )
};

export default GameHistory;