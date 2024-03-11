// src/games/Flip/index.tsx

import { Cockfight } from "./Cockfight"; // Updated import
import { GambaUi, useCurrentToken, useSound } from "gamba-react-ui-v2";
import { Canvas } from "@react-three/fiber";
import { Effect } from "./Effect";
import React from "react";
import { useGamba } from "gamba-react-v2";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

// Updated SIDES for cockfight
const SIDES = {
  white: [2, 0],
  black: [0, 2],
};

// Update sounds if necessary or keep them if they're still applicable
const SOUND_COIN = "/games/flip/coin.mp3"; // Consider renaming or changing this sound
const SOUND_WIN = "/games/flip/win.mp3";
const SOUND_LOSE = "/games/flip/lose.mp3";

type Side = keyof typeof SIDES;

function Flip() {
  const game = GambaUi.useGame();
  const token = useCurrentToken();
  const gamba = useGamba();
  const [flipping, setFlipping] = React.useState(false);
  const [win, setWin] = React.useState(false);
  const [result, setResult] = React.useState<string>(""); // Updated to handle more outcomes
  const [side, setSide] = React.useState<Side>("white"); // Default to "white"

  const walletModal = useWalletModal();
  const wallet = useWallet();

  const connect = () => {
    if (wallet.wallet) {
      wallet.connect();
    } else {
      walletModal.setVisible(true);
    }
  };

  const WAGER_OPTIONS = [1, 5, 10, 50, 100].map((x) => x * token.baseWager);

  const [wager, setWager] = React.useState(WAGER_OPTIONS[0]);

  const sounds = useSound({
    coin: SOUND_COIN,
    win: SOUND_WIN,
    lose: SOUND_LOSE,
  });

  const play = async () => {
    try {
      setWin(false);
      setFlipping(true);
      sounds.play("coin", { playbackRate: 0.5 });
      await game.play({
        bet: SIDES[side],
        wager,
        metadata: [side],
      });
      sounds.play("coin");
      const gameResult = await gamba.result();
      const win = gameResult.payout > 0;
      setResult(win ? `${side}Win` : `${side}Loss`); // Construct result string
      setWin(win);
      if (win) {
        sounds.play("win");
      } else {
        sounds.play("lose");
      }
    } finally {
      setFlipping(false);
    }
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        <Canvas
          linear
          flat
          orthographic
          camera={{
            zoom: 80,
            position: [0, 0, 100],
          }}
        >
          <React.Suspense fallback={null}>
            <Cockfight result={result} flipping={flipping} /> {/* Updated component usage */}
          </React.Suspense>
          <Effect color="white" />
          {flipping && <Effect color="white" />}
          {win && <Effect color="#42ff78" />}
          <ambientLight intensity={3} />
          <directionalLight position-z={1} position-y={1} castShadow color="#CCCCCC" />
          <hemisphereLight intensity={0.5} position={[0, 1, 0]} scale={[1, 1, 1]} color="#ffadad" groundColor="#6666fe" />
        </Canvas>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerSelect options={WAGER_OPTIONS} value={wager} onChange={setWager} />
        <GambaUi.Button
          disabled={gamba.isPlaying}
          onClick={() => setSide(side === "white" ? "black" : "white")}
        >
          {/* Updated button to toggle between white and black roosters */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            Choose {side === "white" ? "Black" : "White"} Rooster
          </div>
        </GambaUi.Button>
        {wallet.connected ? (
          <GambaUi.PlayButton onClick={play}>Fight!</GambaUi.PlayButton> // Updated button text
        ) : (
          <GambaUi.Button main onClick={connect}>Play</GambaUi.Button>
        )}
      </GambaUi.Portal>
    </>
  );
}

export default Flip;
