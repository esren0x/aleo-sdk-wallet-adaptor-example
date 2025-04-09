import React, { useEffect, useState } from 'react';
import { useGameState } from "../components/GameState.jsx";
import {
    Transaction,
    WalletAdapterNetwork,
    WalletNotConnectedError,
} from "@demox-labs/aleo-wallet-adapter-base";
import {
    Address,
    AleoNetworkClient,
    BHP256,
    Plaintext,
} from '@provablehq/sdk';
import { RotatingSquare } from 'react-loader-spinner';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { Button, Spin, Table } from 'antd';

const GameHistory = () => {
    const { publicKey } = useWallet();
    const { bhp, networkClient, games, numGames, setGames, setNumGames, formatGame } = useGameState();

    const [gamesLoading, setGamesLoading] = useState(true);
    const [page, setPage] = useState(0);

    const addressPlaintextBits = Address.from_string(publicKey).toPlaintext().toBitsLe();
    const addressHash = bhp.hash(addressPlaintextBits);

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

    useEffect(() => {
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
            setGames(g);
            setGamesLoading(false);
        });
    }, [page]);

    return (
        <div className='history-container'>
        {publicKey && <h4>Game History for <span className='address'>{publicKey}</span></h4>}
            {
                gamesLoading ?
                <div style={ { display: 'flex', justifyContent: 'center' } }>
                <Spin size='large' tip='Loading...' ><div style={{
                    padding: 50,
                    borderRadius: 4,
                }} /></Spin>
                </div> :
                <Table
                    dataSource={games.map(game => formatGame(game))}
                    columns={
                        [
                            {
                                title: "Game #",
                                dataIndex: "game",
                                key: "game",
                            },
                            {
                                title: "Player Move",
                                dataIndex: "playerMove",
                                key: "playerMove",
                            },
                            {
                                title: "System Move",
                                dataIndex: "systemMove",
                                key: "systemMove",
                            },
                            {
                                title: "Outcome",
                                dataIndex: "outcome",
                                key: "outcome",
                            },
                        ]
                    }
                    pagination={{
                        hideOnSinglePage: true,
                    }}
                />
            }
            <br />
            <div className='buttonRow'>
                <Button className="button" onClick={handlePageDown} disabled={page <= 0}>Prev</Button>
                <Button className="button" onClick={handlePageUp} disabled={(page + 1) * 5 > numGames - 1}>Next</Button>
            </div>
        </div>
    )
};

export default GameHistory;