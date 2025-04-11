import { createBrowserRouter } from "react-router-dom";
import Main from "./main.jsx";
import Game from "./pages/Game.jsx";
import GameHistory from "./pages/GameHistory.jsx";
import PlayerStats from "./pages/PlayerStats.jsx";

export const router = createBrowserRouter([
    {
        element: <Main />,
        children: [
            {
                path: "/",
                element: (
                    <>
                        <Game />
                    </>
                )
            },
            {
                path: "/history",
                element: (
                    <>
                        <GameHistory />
                    </>
                )
            },
            {
                path: "/stats",
                element: (
                    <>
                        <PlayerStats />
                    </>
                )
            }
        ]
    },
]);
