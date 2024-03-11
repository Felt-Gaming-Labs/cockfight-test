// src/components/sections/Dashboard/Dashboard.tsx

import { GAMES } from "@/games";
import { GameCard } from "./GameCard";
import React from "react";
import { WelcomeBanner } from "./WelcomeBanner";

export function GameGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {GAMES.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

export default function Dashboard() {
  return (
    <>
      <WelcomeBanner />
      <h2 className="text-2xl font-bold text-center">Games</h2>
      <GameGrid />
    </>
  );
}
