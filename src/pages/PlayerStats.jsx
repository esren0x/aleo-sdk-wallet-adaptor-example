import React, { useEffect, useState } from 'react';
import {
    Address,
    AleoNetworkClient,
    BHP256,
    initThreadPool,
} from '@provablehq/sdk';
import { useGameState } from '../components/GameState';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { Spin, Table } from 'antd';

const PlayerStats = () => {

    const { publicKey } = useWallet();

    const [stats, setStats] = useState({wins: 0, losses: 0, draws: 0});
    const [statsLoading, setStatsLoading] = useState(true);

    const { numGames } = useGameState();

    const networkClient = new AleoNetworkClient("https://api.explorer.provable.com/v1");
    const bhp = new BHP256();
    const addressPlaintextBits = Address.from_string(publicKey).toPlaintext().toBitsLe();
    const addressHash = bhp.hash(addressPlaintextBits);

    const getStats = async () => {
        let stats = (await networkClient.getProgramMappingPlaintext("rockpaperscissors_game_v0_1_1.aleo", "stats", addressHash)).toObject();
        let wins = Number(stats.wins);
        let losses = Number(stats.losses);
        let draws = numGames - (wins + losses);
        return { wins, losses, draws };
    };

    useEffect(() => {
        getStats()
            .then(res => {
                setStats(res);
                setStatsLoading(false);
            })
    }, [numGames, stats]);

    return (
        <div>
            <h3>Stats for {publicKey}</h3>
            {/* <p>Wins: {stats.wins} - Losses: {stats.losses} - Draws: {stats.draws}</p> */}
            {statsLoading ?
            <Spin size='large' tip='Loading...' ><div style={{
                padding: 50,
                borderRadius: 4,
            }} /></Spin> :
            <Table 
                dataSource={
                    [
                        {
                            wins: stats.wins,
                            losses: stats.losses,
                            draws: stats.draws,
                        }
                    ]
                }
                columns={
                    [
                        {
                            title: "Wins",
                            dataIndex: "wins",
                            key: "wins",
                        },
                        {
                            title: "Losses",
                            dataIndex: "losses",
                            key: "losses",
                        },
                        {
                            title: "Draws",
                            dataIndex: "draws",
                            key: "draws",
                        },
                    ]
                }
                pagination={{
                    hideOnSinglePage: true,
                }}
            />}
        </div>
    )
};

export default PlayerStats;