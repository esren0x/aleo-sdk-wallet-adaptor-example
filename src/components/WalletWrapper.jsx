import { useMemo } from "react";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import {
    PuzzleWalletAdapter,
    FoxWalletAdapter,
    SoterWalletAdapter,
    // configureConnectionForPuzzle,
} from "aleo-adapters";
import {
    DecryptPermission,
    WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

// Configure the wallet options to be used in the application.
export const WalletWrapper = ({ children }) => {
    // Initialize wallets inside a functional component using useMemo.
    const wallets = useMemo(
        () => [
            new LeoWalletAdapter({
                appName: "Rock Paper Scissors",
            }),
            new PuzzleWalletAdapter({
                programIdPermissions: {
                    ["AleoMainnet"]: [
                        "rockpaperscissors_game_v0_1_1.aleo",
                    ],
                    [WalletAdapterNetwork.TestnetBeta]: [
                        "rockpaperscissors_game_v0_1_1.aleo",
                    ],
                },
                appName: "Rock Paper Scissors",
                appDescription: "A simple rock paper scissors game",
            }),
        ],
        []
    );

    return (
        <WalletProvider
            wallets={wallets}
            decryptPermission={DecryptPermission.OnChainHistory}
            network={WalletAdapterNetwork.TestnetBeta} // Change to 'MainnetBeta' or 'TestnetBeta' if needed
            autoConnect
        >
            <WalletModalProvider>
                {children}
            </WalletModalProvider>
        </WalletProvider>
    );
};