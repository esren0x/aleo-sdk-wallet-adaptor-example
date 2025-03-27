// The 'rockpaperscissors_game' program.
program rockpaperscissors_game_v0_1_0.aleo {
    // Constant: Hash of system's address representing the opponent (Player 2).
    const SYSTEM_HASH: field = 5573883837986336656403728900743138501878058223219165284100750751991779905667field;

    // Stand-in for an outcomes enum.
    const TIE: u8 = 0u8;
    const PLAYER_WIN: u8 = 1u8;
    const SYSTEM_WIN: u8 = 2u8;

    // Struct of a player hash and a game index.
    // To be hashed and used as the key in the `history` mapping.
    struct Game {
        player_hash: field,
        game_index: u64,
    }

    // Struct to track wins and losses per player.
    struct Stats {
        wins: u64,
        losses: u64,
    }

    // Struct representing the outcome of a game including both players' moves.
    struct Outcome {
        player_move: u8,
        system_move: u8,
        outcome: u8,
    }

    // Mapping to store stats for each player (keyed by a hash of their address).
    mapping stats: field => Stats;

    // Mapping to store number of games played by a player.
    mapping game_count: field => u64;

    // Mapping of the hash of the players address and the game index per player to the outcome of the game.
    mapping history: field => Outcome;

    async transition play(player_move: u8) -> Future {
        // Assert that the move is valid.
        assert(player_move <= 2u8);

        let player_hash: field = BHP256::hash_to_field(self.caller);

        return finalize_play(player_hash, player_move);
    }

    /// Finalize function: Completes the game round.
    /// Generates the systems move using ChaCha randomness, computes the outcome,
    /// and updates on-chain state (history and stats).
    async function finalize_play(player_hash: field, player_move: u8) {
        // Generate a random move for the system using ChaCha randomness.
        let random_byte: u8 = ChaCha::rand_u8();
        let system_move: u8 = random_byte % 3u8;

        // Calculate the outcome (player_move - system_move) mod 3.
        let outcome: u8 = ((player_move + 3u8) - system_move) % 3u8;

        // Get current stats for player and system.
        let player_stats: Stats = stats.get_or_use(player_hash, Stats { wins: 0u64, losses: 0u64 });
        let system_stats: Stats = stats.get_or_use(SYSTEM_HASH, Stats { wins: 0u64, losses: 0u64 });

        // Update stats based on game winner/loser.
        if outcome == PLAYER_WIN {
            // Player wins.
            stats.set(player_hash, Stats { wins: player_stats.wins + 1u64, losses: player_stats.losses });
            stats.set(SYSTEM_HASH, Stats { wins: system_stats.wins, losses: system_stats.losses + 1u64 });
        } else if outcome == SYSTEM_WIN {
            // System wins.
            stats.set(player_hash, Stats { wins: player_stats.wins, losses: player_stats.losses + 1u64 });
            stats.set(SYSTEM_HASH, Stats { wins: system_stats.wins + 1u64, losses: system_stats.losses });
        }
        // No stats are updated on tie.

        // Get the per-player index of the current game.
        let game_index: u64 = game_count.get_or_use(player_hash, 0u64);
        // Get the history key as a hash of (player_hash, game_index);
        let history_key: field = BHP256::hash_to_field(Game { player_hash, game_index });

        // Append current game to history mapping.
        history.set(history_key, Outcome { player_move, system_move, outcome });
        // Increment the per-player game index.
        game_count.set(player_hash, game_index + 1u64);
    }
}