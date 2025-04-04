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
import { RotatingSquare } from 'react-loader-spinner';

const GameHistory = ({ wallet, publicKey, games, setGames, numGames, setNumGames }) => {
    initThreadPool().then(() => {});
    const networkClient = new AleoNetworkClient("https://api.explorer.provable.com/v1");

    const [gamesLoading, setGamesLoading] = useState(true);
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

        let pt = Plaintext.fromString(gameStruct);
        let bits = pt.toBitsLe();
        let hash = bhp.hash(bits);
        let game = await networkClient.getProgramMappingPlaintext("rockpaperscissors_game_v0_1_1.aleo", "history", hash);
        return game.toObject();
    };

    const handlePageDown = () => {
        if (page > 0) {
            setPage(page-1);
            setGamesLoading(true);
        }
    }

    const handlePageUp = () => {
        if ((page + 1) * 5 <= numGames - 1) {
            setPage(page+1);
            setGamesLoading(true);
        }
    }

    const displayGame = (game) => {
        const translateMove = (move) => {
            if (move === 0) {
                return '✊';
            } else if (move === 1) {
                return '✋';
            } else {
                return '✌️';
            }
        }

        const translateResult = (res) => {
            if (res === 0) {
                return "Draw";
            } else if (res === 1) {
                return "Player Wins";
            } else {
                return "Player Loses";
            }
        }

        // return <li>{`Game ${game.key} - Player Move: ${translateMove(game.player_move)} - System Move: ${translateMove(game.system_move)} - ${translateResult(game.outcome)}`}</li>
        return <tr>
            <td>{game.key}</td>
            <td>{translateMove(game.player_move)}</td>
            <td>{translateMove(game.system_move)}</td>
            <td>{translateResult(game.outcome)}</td>
        </tr>
    }

    useEffect(() => {
        gamesPlayed().then((numGames) => {
            setNumGames(numGames);
            const start = page * 5;
            const buildPage = async (start) => {
                let gamesOnPage = [];
                const end = start + 4;
                for (let i = start; i <= end; i++) {
                    const key = numGames - 1 - i;
                    if (key < 0) {
                        break;
                    }
                    let game = await fetchGame(key);
                    game.key = key + 1;
                    gamesOnPage.push(game);
                }
                return gamesOnPage;
            }
            buildPage(start).then(g => {
                setGamesLoading(false);
                console.log("GAMES: ", g);
                setGames(g);
            });
        });
    }, [page]);

    return (
        <div className='history-container'>
        {publicKey && <h4>Game History for {publicKey}:</h4>}
            {
                gamesLoading ?
                <div style={ { display: 'flex', justifyContent: 'center' } }>
                <RotatingSquare
                    visible={true}
                    height="100"
                    width="100"
                    color="#1553fa"
                    ariaLabel="rotating-square-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    />
                </div> :
                <table>
                    <tr>
                        <th>Game #</th>
                        <th>Player Move</th>
                        <th>System Move</th>
                        <th>Outcome</th>
                    </tr>
                    {games.map(game => {
                        return displayGame(game);
                    })}
                </table>
            }
            <br />
            <div>
                <button onClick={handlePageDown} disabled={page <= 0}>Prev</button>
                <button onClick={handlePageUp} disabled={(page + 1) * 5 > numGames - 1}>Next</button>
            </div>
        </div>
    )
};

export default GameHistory;