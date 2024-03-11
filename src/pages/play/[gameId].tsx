// src/pages/play/[gameId].tsx
import CustomRenderer, {
  CustomError,
  GameSlider,
} from "@/components/sections/Game/Game";

import { GAMES } from "@/games";
import { GambaUi } from "gamba-react-ui-v2";
import Header from "@/components/layout/Header";
import React from "react";
import { useRouter } from "next/router";

interface GameProps {
  gameId: string;
  key?: string;
}

const Game: React.FC<GameProps> = ({ gameId }) => {
  const game = GAMES.find((x) => x.id === gameId);

  return (
    <>
      {game ? (
        <div className="flex flex-col justify-center items-center mx-auto max-w-6xl max-sm:max-w-sm pt-20">
          <GambaUi.Game game={game} errorFallback={<CustomError />}>
            <CustomRenderer />
          </GambaUi.Game>
        </div>
      ) : (
        <div className="bg-black animate-pulse mt-20 flex flex-col justify-center items-center mx-auto max-w-5xl px-10 py-20 rounded-lg shadow-xl">
          <div className="flex flex-col justify-center items-center max-w-lg rounded-lg">
            <video
              src="/gamba.mp4"
              className="w-full h-full"
              autoPlay
              muted
              playsInline
              loop
            />
            <p className="text-2xl text-white mt-5">
              Loading or Invalid game ID...
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-col justify-center items-center mx-auto max-w-6xl max-sm:max-w-sm mb-4">
        <div className="py-4">
          <GameSlider />
        </div>
      </div>
    </>
  );
};

const GamePage: React.FC = () => {
  const router = useRouter();
  const { gameId } = router.query;

  return (
    <>
      <Header />
      <Game gameId={gameId as string} key={gameId as string} />
    </>
  );
};

export default GamePage;
