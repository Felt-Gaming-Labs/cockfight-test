// src/games/Keno/index.tsx
/*
 * Author: BankkRoll
 */
import { CellButton, Container, Grid } from "./keno.styles";
import { GambaUi, useSound, useWagerInput } from "gamba-react-ui-v2";
import React, { useEffect, useState } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const GRID_SIZE = 40;
const MAX_SELECTION = 10;

export default function Keno() {
  const [wager, setWager] = useWagerInput();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [revealedBlocks, setRevealedBlocks] = useState(new Set());
  const [gameWon, setGameWon] = useState<boolean | null>(null);
  const game = GambaUi.useGame();
  const walletModal = useWalletModal();
  const wallet = useWallet();
  const sounds = useSound({
    reveal: "/games/keno/reveal.mp3",
    win: "/games/keno/win.mp3",
    lose: "/games/keno/lose.mp3",
  });

  const connect = () => {
    if (wallet.wallet) {
      wallet.connect();
    } else {
      walletModal.setVisible(true);
    }
  };

  const toggleNumberSelection = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else if (selectedNumbers.length < MAX_SELECTION) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const resetGame = () => {
    setSelectedNumbers([]);
    setRevealedBlocks(new Set());
    setDrawnNumbers([]);
    setGameWon(null);
  };

  const play = async () => {
    setRevealedBlocks(new Set());
    setGameWon(null);
    setIsPlaying(true);
    try {
      await game.play({
        wager,
        bet: generateBetArray(selectedNumbers.length),
        metadata: ["Bankkmatic Games (https://x.com/bankkroll_eth)"],
      });

      const gameResult = await game.result();
      const win = gameResult.payout > 0;
      const simulatedDrawnNumbers = simulateDrawnNumbers(win, selectedNumbers);
      setDrawnNumbers(simulatedDrawnNumbers);

      revealDrawnNumbers(simulatedDrawnNumbers, win);
      setGameWon(win);
      setIsPlaying(false);
    } catch (error) {
      setIsPlaying(false);
      console.error("Error playing game:", error);
    }
  };

  const revealDrawnNumbers = async (drawnNumbers: number[], win: boolean) => {
    for (let i = 0; i < drawnNumbers.length; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          setRevealedBlocks((prev) => new Set(prev).add(drawnNumbers[i]));
          sounds.play("reveal");

          resolve(true);
        }, 200);
      });
    }

    setTimeout(() => {
      win ? sounds.play("win") : sounds.play("lose");
    }, drawnNumbers.length);
  };

  const simulateDrawnNumbers = (win: boolean, selected: number[]): number[] => {
    if (win) {
      const remainingNumbers = generateRandomNumbers(
        GRID_SIZE - 1,
        selected,
        GRID_SIZE,
      );
      shuffleArray(remainingNumbers);
      const winningNumbers = remainingNumbers.slice(0, 9);
      return [...winningNumbers, selected[0]];
    } else {
      return generateRandomNumbers(10, selected, GRID_SIZE);
    }
  };

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const generateRandomNumbers = (
    count: number,
    exclude: number[],
    max: number,
  ) => {
    let nums: number[] = [];
    while (nums.length < count) {
      let n = Math.floor(Math.random() * max) + 1;
      if (!nums.includes(n) && !exclude.includes(n)) {
        nums.push(n);
      }
    }
    return nums;
  };

  const generateBetArray = (selectionCount: number): number[] => {
    const validSelectionCount = Math.min(selectionCount, 10);
    const totalBetUnits = 40;

    if (validSelectionCount === 0) {
      return new Array(40).fill(0);
    }

    const baseBetPerSelection = Math.floor(totalBetUnits / validSelectionCount);
    const remainder = totalBetUnits % validSelectionCount;

    const betArray = new Array(validSelectionCount).fill(baseBetPerSelection);

    for (let i = 0; i < remainder; i++) {
      betArray[i] += 1;
    }

    for (let i = validSelectionCount; i < 40; i++) {
      betArray.push(0);
    }

    return betArray;
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        <GambaUi.Responsive>
          <Container>
            <Grid>
              {Array.from({ length: GRID_SIZE }, (_, i) => i + 1).map(
                (number) => (
                  <CellButton
                    disabled={
                      isPlaying ||
                      revealedBlocks.has(number) ||
                      (selectedNumbers.length >= MAX_SELECTION &&
                        !selectedNumbers.includes(number)) ||
                      gameWon !== null
                    }
                    key={number}
                    selected={selectedNumbers.includes(number)}
                    $revealed={revealedBlocks.has(number)}
                    $revealedWin={
                      selectedNumbers.includes(number) &&
                      revealedBlocks.has(number)
                    }
                    $revealedLoss={
                      !selectedNumbers.includes(number) &&
                      revealedBlocks.has(number)
                    }
                    onClick={() => toggleNumberSelection(number)}
                  >
                    {number}
                  </CellButton>
                ),
              )}
            </Grid>
          </Container>
          <p style={{ textAlign: "center" }}>
            {gameWon === true
              ? "Clear the board to play again."
              : gameWon === false
                ? "Clear the board to play again."
                : null}
          </p>
        </GambaUi.Responsive>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        {wallet.connected ? (
          <>
            <GambaUi.PlayButton disabled={isPlaying} onClick={resetGame}>
              Clear
            </GambaUi.PlayButton>
            <GambaUi.PlayButton
              disabled={
                selectedNumbers.length === 0 || isPlaying || gameWon !== null
              }
              onClick={play}
            >
              Play
            </GambaUi.PlayButton>
          </>
        ) : (
          <GambaUi.Button main onClick={connect}>
            Play
          </GambaUi.Button>
        )}
      </GambaUi.Portal>
    </>
  );
}
