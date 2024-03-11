// src/games/Wheel/index.tsx
/*
 * Author: BankkRoll
 */

import * as PIXI from "pixi.js";

import {
  DEGEN_BET,
  DEGEN_SEGMENT_COLORS,
  DEGEN_WHEEL_SEGMENTS,
  MEGA_BET,
  MEGA_SEGMENT_COLORS,
  MEGA_WHEEL_SEGMENTS,
  REGULAR_BET,
  REGULAR_SEGMENT_COLORS,
  REGULAR_WHEEL_SEGMENTS,
} from "./game";
import { GambaUi, useSound, useWagerInput } from "gamba-react-ui-v2";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { drawTicker, drawWheel, radius } from "./wheel";

import { gsap } from "gsap";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function WheelGame() {
  const [wager, setWager] = useWagerInput();
  const [spinning, setSpinning] = useState(false);
  const [gameMode, setGameMode] = useState<string>("regular");
  const wheelContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const walletModal = useWalletModal();
  const wallet = useWallet();
  const game = GambaUi.useGame();
  const sounds = useSound({
    spin: "/games/wheel/spinning.mp3",
    win: "/games/wheel/win.mp3",
    lose: "/games/wheel/lose.mp3",
  });

  const connect = () => {
    if (wallet.wallet) {
      wallet.connect();
    } else {
      walletModal.setVisible(true);
    }
  };

  useEffect(() => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
      backgroundColor: 0x0c0c11,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    appRef.current = app;

    const wheel = new PIXI.Container();
    wheel.position.set(app.screen.width / 2, app.screen.height / 2);
    app.stage.addChild(wheel as PIXI.DisplayObject);
    drawWheel(wheel, REGULAR_WHEEL_SEGMENTS, REGULAR_SEGMENT_COLORS);
    drawTicker(app, radius);

    if (wheelContainerRef.current) {
      wheelContainerRef.current.appendChild(app.view as unknown as Node);
      if (app.view && app.view.style) {
        app.view.style.width = "100%";
        app.view.style.height = "100%";
      }
    }

    return () =>
      app.destroy(true, { children: true, texture: true, baseTexture: true });
  }, []);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    const wheel = app.stage.children[0] as PIXI.Container;

    switch (gameMode) {
      case "degen":
        drawWheel(wheel, DEGEN_WHEEL_SEGMENTS, DEGEN_SEGMENT_COLORS);
        break;
      case "mega":
        drawWheel(wheel, MEGA_WHEEL_SEGMENTS, MEGA_SEGMENT_COLORS);
        break;
      default:
        drawWheel(wheel, REGULAR_WHEEL_SEGMENTS, REGULAR_SEGMENT_COLORS);
        break;
    }
  }, [gameMode]);

  const spinWheel = useCallback(async () => {
    try {
      if (!appRef.current) return;

      if (!appRef.current) {
        console.error("PIXI Application is not initialized.");
        return;
      }
      const wheel = appRef.current.stage.children[0] as PIXI.Container;
      if (!wheel) {
        console.error("Wheel is not found in the PIXI application.");
        return;
      }

      wheel.rotation %= 2 * Math.PI;

      let bet: number[];
      let segments: string[];
      switch (gameMode) {
        case "degen":
          bet = DEGEN_BET;
          segments = DEGEN_WHEEL_SEGMENTS;
          break;
        case "mega":
          bet = MEGA_BET;
          segments = MEGA_WHEEL_SEGMENTS;
          break;
        default:
          bet = REGULAR_BET;
          segments = REGULAR_WHEEL_SEGMENTS;
      }

      await game.play({
        wager,
        bet,
        metadata: ["Bankkmatic Games (https://x.com/bankkroll_eth)"],
      });
      setSpinning(true);
      const result = await game.result();
      sounds.play("spin", { playbackRate: 0.5 });

      const segmentAngle = 360 / segments.length;
      const halfSegmentOffset = segmentAngle / 2;
      const finalAngleAdjustment = 360 * 5;
      const finalRotationAngle = -(
        finalAngleAdjustment +
        result.resultIndex * segmentAngle +
        halfSegmentOffset -
        90
      );

      gsap.to(wheel, {
        rotation: finalRotationAngle * (Math.PI / 180),
        duration: 8,
        ease: "power2.out",
        yoyo: true,
        onComplete: () => {
          setSpinning(false);
          const winningSegmentValue = segments[result.resultIndex];

          const isWin = winningSegmentValue !== "0X";

          if (isWin) {
            sounds.play("win");
          } else {
            sounds.play("lose");
          }
        },
      });
    } catch (error) {
      console.log(error);
      setSpinning(false);
    }
  }, [game, sounds, wager, gameMode]);

  const gameModeOptions: string[] = ["regular", "degen", "mega"];

  return (
    <>
      <GambaUi.Portal target="screen">
        <div className="flex flex-col justify-center items-center">
          <div ref={wheelContainerRef} />
        </div>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        <span>Mode:</span>
        <GambaUi.Select
          options={gameModeOptions}
          value={gameMode}
          onChange={setGameMode}
          label={(value: string) =>
            value.charAt(0).toUpperCase() + value.slice(1)
          }
        />
        {wallet.connected ? (
          <GambaUi.PlayButton onClick={spinWheel} disabled={spinning}>
            {spinning ? "Spinning..." : "Spin"}
          </GambaUi.PlayButton>
        ) : (
          <GambaUi.Button main onClick={connect}>
            Spin
          </GambaUi.Button>
        )}
      </GambaUi.Portal>
    </>
  );
}
