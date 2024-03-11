// src/components/sections/Game/Game.tsx

import { GambaUi, useGambaAudioStore } from "gamba-react-ui-v2";
import React, { useEffect, useState } from "react";

import { GAMES } from "@/games";
import { GameCard } from "@/components/sections/Dashboard/GameCard";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { ProvablyFairModal } from "./ProvablyFairModal";
import { SlideSection } from "@/components/ui/Slider";
import { useGamba } from "gamba-react-v2";
import { useUserStore } from "@/hooks/useUserStore";

export function GameSlider() {
  return (
    <>
      <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center">
        {GAMES.map((game) => (
          <div
            key={game.id}
            className="w-48 md:w-64 p-2 flex justify-center md:my-2"
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </>
  );
}

export function CustomError() {
  return (
    <>
      <GambaUi.Portal target="error">
        <GambaUi.Responsive>
          <h1>😭 Oh no!</h1>
          <p>Something went wrong</p>
        </GambaUi.Responsive>
      </GambaUi.Portal>
    </>
  );
}

/**
 * A renderer component to display the contents of the loaded GambaUi.Game
 * Screen
 * Controls
 */
export default function CustomRenderer() {
  const gamba = useGamba();
  const { game } = GambaUi.useGame();
  const [info, setInfo] = useState(false);
  const [provablyFair, setProvablyFair] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const audioStore = useGambaAudioStore();
  const imagePath = `/games/${game.id}/logo.png`;
  const { newcomer, gamesPlayed, set } = useUserStore();

  useEffect(() => {
    if (newcomer || !gamesPlayed.includes(game.id)) {
      setInfo(true);

      set((state) => ({
        newcomer: false,
        gamesPlayed: [...state.gamesPlayed, game.id],
      }));
    }
  }, [game.id, gamesPlayed, newcomer, set]);

  return (
    <>
      {info && (
        <Modal onClose={() => setInfo(false)}>
          <img
            height="150px"
            src={imagePath}
            alt={`Splash for ${game.meta.name}`}
          />
          <h1>{game.meta.name}</h1>
          <p>{game.meta.description}</p>
        </Modal>
      )}
      {provablyFair && (
        <ProvablyFairModal onClose={() => setProvablyFair(false)} />
      )}
      <div className="w-full relative grid gap-1">
        {showSplash && (
          <div className="pointer-events-none absolute inset-0 flex justify-center items-center z-10 bg-[#0c0c11] text-6xl font-bold animate-[splashAnimation_1s_ease-out_forwards]">
            <img
              height="150px"
              src={imagePath}
              alt={`Splash for ${game.meta.name}`}
            />
          </div>
        )}
        <div className="relative flex-grow bg-[#0c0c11] rounded-lg overflow-hidden transition-height duration-200 md:min-h-[550px] min-h-[500px]">
          <GambaUi.PortalTarget target="error" />
          <GambaUi.PortalTarget target="screen" />
          <div className="absolute left-0 bottom-0 p-1 flex gap-2">
            <button
              onClick={() =>
                audioStore.set((audioStore.masterGain + 0.25) % 1.25)
              }
            >
              Volume: {audioStore.masterGain * 100}%
            </button>
          </div>
        </div>
        <div
          className={`relative h-1 max-w-[100svw] overflow-hidden rounded-lg after:content-[' '] after:absolute after:w-[25%] after:h-full after:bg-[#9564ff] after:transition-opacity duration-500 ${
            gamba.isPlaying
              ? " animate-[loadingAnimation_1.5s_infinite] after:opacity-100"
              : "after:opacity-0"
          }`}
          key={Number(gamba.isPlaying)}
          data-active={gamba.isPlaying}
        />

        <div className="w-full bg-[#1A1B28] p-2 sm:p-5 text-white rounded-lg flex flex-wrap gap-2 sm:gap-5 items-start sm:flex-row">
          <div className="flex gap-2 justify-center">
            <button
              className="p-2 text-white bg-transparent hover:bg-[#ffffff22] rounded-lg cursor-pointer focus:outline-none"
              onClick={() => setInfo(true)}
            >
              <Icon.Info />
            </button>
            <button
              className="p-2 text-white bg-transparent hover:bg-[#ffffff22] rounded-lg cursor-pointer focus:outline-none"
              onClick={() => setProvablyFair(true)}
            >
              <Icon.Fairness />
            </button>
          </div>
          <div className="flex-grow flex items-center justify-start gap-2">
            <GambaUi.PortalTarget target="controls" />
            <GambaUi.PortalTarget target="play" />
          </div>
        </div>
      </div>
    </>
  );
}
