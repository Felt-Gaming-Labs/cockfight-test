// src/games/Limbo/index.tsx
/*
 * Author: BankkRoll
 */

import { GambaUi, useSound, useWagerInput } from "gamba-react-ui-v2";
import React, { useState } from "react";

import useCustomPlay from "@/hooks/useCustomPlay";
import { useGamba } from "gamba-react-v2";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function Limbo() {
  const game = GambaUi.useGame();
  const gambaBPlay = useCustomPlay("Limbo");
  const [wager, setWager] = useWagerInput();
  const [targetMultiplier, setTargetMultiplier] = useState<number>(20);
  const [resultMultiplier, setResultMultiplier] = useState<number>(1);
  const [playing, setPlaying] = useState<boolean>(false);
  const [isWin, setIsWin] = useState<boolean | null>(null);
  const [textColor, setTextColor] = useState<string>("#FFFFFF");
  const walletModal = useWalletModal();
  const wallet = useWallet();
  const sounds = useSound({
    spin: "/games/limbo/numbers.mp3",
    win: "/games/limbo/win.mp3",
    lose: "/games/limbo/lose.mp3",
    tick: "/games/limbo/tick.mp3",
  });

  const connect = () => {
    if (wallet.wallet) {
      wallet.connect();
    } else {
      walletModal.setVisible(true);
    }
  };

  const handleMultiplierChange = (value: string) => {
    setTargetMultiplier(Math.max(2, Math.min(100, parseFloat(value))));
    sounds.play("tick");
  };

  const startAnimation = (
    start: number,
    end: number,
    winCondition: boolean,
  ) => {
    let startTime: number | null = null;
    const duration = 2500;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setResultMultiplier(start + (end - start) * progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTextColor(winCondition ? "#10B981" : "#EF4444");
        sounds.play(winCondition ? "win" : "lose");
      }
    };

    requestAnimationFrame(animate);
  };

  const play = async () => {
    try {
      setPlaying(true);
      setResultMultiplier(1);
      setTextColor("#FFFFFF");

      await gambaBPlay(
        wager,
        new Array(targetMultiplier)
          .fill(0)
          .map((_, index) => (index === 0 ? targetMultiplier : 0)),
      );
      const result = await game.result();

      const winCondition = result.multiplier >= targetMultiplier;
      setIsWin(winCondition);
      sounds.play("spin", { playbackRate: 0.8 });
      const endMultiplier = winCondition
        ? targetMultiplier + Math.random() * targetMultiplier * 0.2
        : 1 + Math.random() * (targetMultiplier - 1);

      setTimeout(() => startAnimation(1, endMultiplier, winCondition), 500);
      setPlaying(false);
    } catch (error) {
      console.log(error);
      setPlaying(false);
    }
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        <GambaUi.Responsive>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "500px",
              transition: "all 0.5s ease-in-out",
            }}
          >
            <div
              style={{
                fontSize: "100px",
                fontWeight: "bold",
                color: textColor,
                transition: "color 0.5s ease-in-out",
              }}
            >
              {resultMultiplier.toFixed(2)}x
            </div>
          </div>
        </GambaUi.Responsive>
        <div
          style={{
            position: "absolute",
            bottom: "4px",
            right: "4px",
            zIndex: 1000,
          }}
        >
          <a
            href="https://x.com/bankkroll_eth"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "14px",
              color: "#fff",
              padding: "10px",
            }}
          >
            BankmaticGames
          </a>
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            height: "40px",
          }}
        >
          <label style={{ position: "absolute", right: "40px", top: "-10px" }}>
            Target
          </label>
          <input
            id="targetMultiplier"
            placeholder="Target Multiplier"
            type="range"
            min={2}
            max={100}
            step={1}
            value={String(targetMultiplier)}
            onChange={(e) => handleMultiplierChange(e.target.value)}
          />
          <label
            style={{ position: "absolute", right: "40px", bottom: "-10px" }}
          >
            {targetMultiplier}.00X
          </label>
        </div>
        {wallet.connected ? (
          <GambaUi.PlayButton onClick={play} disabled={playing}>
            {playing ? "Playing..." : "Play"}
          </GambaUi.PlayButton>
        ) : (
          <GambaUi.Button main onClick={connect}>
            Play
          </GambaUi.Button>
        )}
      </GambaUi.Portal>
    </>
  );
}
