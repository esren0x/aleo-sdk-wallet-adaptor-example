program rockpaperscissors_game.aleo {
    // Constant: System's address representing the opponent (Player 2).
    const SYSTEM: address = aleo1k6xta9a7wdhrsvaj4e6wf8d26e7p50nvfyex0fys5e4n7mr74qgsgk7hru;

    // Struct to track wins and losses per player.
    struct Stats {
        wins: u32,
        losses: u32,
    }

    // Mapping to store stats for each player (keyed by a hash of their address).
    mapping stats: field => Stats;

    // Struct to record a game round result.
    // result: 0 = tie, 1 = player1 wins, 2 = system wins.
    struct GameResult {
        player1_hash: field,  // hashed address of Player 1
        player2_hash: field,  // hashed address of the system (Player 2)
        result: u8,
    }

    // Mapping to log game history; key is a game index.
    mapping history: u64 => GameResult;

    // Mapping to store the next game index (a simple counter).
    mapping game_count: u64 => u64;

    /// Inline helper to compute the outcome from the difference between moves.
    /// diff: (player_move - system_move) mod 3.
    /// Returns: 0 if tie, 1 if player1 wins, 2 if system wins.
    inline compute_outcome(diff: u8) -> u8 {
        if diff == 0u8 {
            return 0u8;
        } else if diff == 1u8 {
            return 1u8;
        } else {
            return 2u8;
        }
    }

    /// Transition: Play one round of Rock-Paper-Scissors.
    /// The caller provides their move as an input (0, 1, or 2).
    async transition play(player_move: u8) -> (Future) {
        // Ensure the move is valid.
        assert(player_move <= 2u8);

        // Compute a hash of the caller's address for privacy.
        let caller_hash: field = BHP256::hash_to_field(self.caller);
        // Compute the system's (Player 2's) address hash.
        let system_hash: field = BHP256::hash_to_field(SYSTEM);

        // Proceed to finalize the round.
        return finalize_play(caller_hash, system_hash, player_move);
    }

    /// Finalize function: Completes the game round.
    /// Generates the system's move using ChaCha randomness, computes the outcome,
    /// and updates on-chain state (history and stats).
    async function finalize_play(player1_hash: field, player2_hash: field, player_move: u8) {
        // Generate a random move for the system using ChaCha randomness.
        let random_byte: u8 = ChaCha::rand_u8();
        let system_move: u8 = random_byte % 3u8;

        // Calculate diff = (player_move - system_move) mod 3.
        let diff: u8 = ((player_move + 3u8) - system_move) % 3u8;
        // Compute the outcome using the inline helper.
        let outcome: u8 = compute_outcome(diff);

        // Update win/loss stats.
        let p1_stats: Stats = Mapping::get_or_use(stats, player1_hash, Stats { wins: 0u32, losses: 0u32 });
        let p2_stats: Stats = Mapping::get_or_use(stats, player2_hash, Stats { wins: 0u32, losses: 0u32 });

        if outcome == 1u8 {
            // Player 1 wins.
            Mapping::set(stats, player1_hash, Stats { wins: p1_stats.wins + 1u32, losses: p1_stats.losses });
            Mapping::set(stats, player2_hash, Stats { wins: p2_stats.wins, losses: p2_stats.losses + 1u32 });
        } else if outcome == 2u8 {
            // System wins.
            Mapping::set(stats, player1_hash, Stats { wins: p1_stats.wins, losses: p1_stats.losses + 1u32 });
            Mapping::set(stats, player2_hash, Stats { wins: p2_stats.wins + 1u32, losses: p2_stats.losses });
        }
        // No stats update on tie.

        // Log the game result in the history mapping.
        let game_index: u64 = Mapping::get_or_use(game_count, 0u64, 0u64);
        let game_record: GameResult = GameResult {
            player1_hash: player1_hash,
            player2_hash: player2_hash,
            result: outcome
        };
        Mapping::set(history, game_index, game_record);
        Mapping::set(game_count, 0u64, game_index + 1u64);
    }
}