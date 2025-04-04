import React, { useEffect, useState } from 'react';
import {
    Address,
    AleoNetworkClient,
    BHP256,
    initThreadPool,
} from '@provablehq/sdk';

const PlayerStats = ({ publicKey, numGames }) => {

    const [stats, setStats] = useState({wins: 0, losses: 0, draws: 0});

    initThreadPool().then(() => {});
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
                console.log(stats)
            })
    }, []);

    return (
        <div>
            <h3>Stats for {publicKey}</h3>
            <p>Wins: {stats.wins} - Losses: {stats.losses} - Draws: {stats.draws}</p>
        </div>
    )
};

export default PlayerStats;