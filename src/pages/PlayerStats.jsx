import React, { useEffect, useState } from 'react';
import { Address } from '@provablehq/sdk';
import { useGameState } from '../components/GameState';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { Spin, Table } from 'antd';

const PlayerStats = () => {

    const { publicKey } = useWallet();

    const [stats, setStats] = useState({wins: 0, losses: 0, draws: 0});
    const [statsLoading, setStatsLoading] = useState(true);

    const { numGames, networkClient, bhp } = useGameState();

    
    const getStats = async () => {
        const addressPlaintextBits = Address.from_string(publicKey).toPlaintext().toBitsLe();
        const addressHash = bhp.hash(addressPlaintextBits);
        const stats = (await networkClient.getProgramMappingPlaintext("rockpaperscissors_game_v0_1_1.aleo", "stats", addressHash)).toObject();
        const wins = Number(stats.wins);
        const losses = Number(stats.losses);
        const draws = numGames - (wins + losses);
        return { wins, losses, draws };
    };

    useEffect(() => {
        getStats()
            .then(res => {
                setStats(res);
                setStatsLoading(false);
            })
    }, [numGames]);

    return (
        <div>
            <h3>Stats for <span className='address'>{publicKey}</span></h3>
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