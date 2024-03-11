// src/games/Flip/index.tsx

import React from "react";
import Cockfight from "./Cockfight"; // Ensure this path matches your project structure
import { GambaUi, useCurrentToken, useSound } from "gamba-react-ui-v2";
import { Effect } from "./Effect";
import { useGamba } from "gamba-react-v2";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const SIDES = {
  white: "white",
  black: "black",
};

const SOUND_COIN = "/games/flip/coin.mp3"; // Consider updating the sound to match the cockfight theme
const SOUND_WIN = "/games/flip/win.mp3";
const SOUND_LOSE = "/games/flip/lose.mp3";

type Side = keyof typeof SIDES;

function Flip() {
  const game = GambaUi.useGame();
  const token = useCurrentToken();
  const gamba = useGamba();
  const [win, setWin] = React.useState(false);
  const [result, setResult] = React.useState<string>("");
  const [side, setSide] = React.useState<Side>("white");

  const walletModal = useWalletModal();
  const wallet = useWallet();

  const connect = () => {
    if (!wallet.connected) {
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
    setWin(false);

    sounds.play("coin", { playbackRate: 0.5 });

    await game.play({
      bet: side === "white" ? [2, 0] : [0, 2], // Updated to use the new SIDES logic
      wager,
      metadata: [side],
    });

    sounds.play("coin");

    const result = await gamba.result();

    setWin(result.payout > 0);
    setResult(side + (result.payout > 0 ? "Win" : "Loss")); // Construct the result string

    if (result.payout > 0) {
      sounds.play("win");
    } else {
      sounds.play("lose");
    }
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        <Cockfight result={result} /> {/* Updated component usage */}
        <Effect color={win ? "#42ff78" : "white"} />
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerSelect
          options={WAGER_OPTIONS}
          value={wager}
          onChange={setWager}
        />
        <GambaUi.Button
          disabled={gamba.isPlaying}
          onClick={() => setSide(side === "white" ? "black" : "white")}
        >
          Choose {side === "white" ? "Black" : "White"} Rooster
        </GambaUi.Button>
        {wallet.connected ? (
          <GambaUi.PlayButton onClick={play}>Fight</GambaUi.PlayButton>
        ) : (
          <GambaUi.Button main onClick={connect}>Play</GambaUi.Button>
        )}
      </GambaUi.Portal>
    </>
  );
}

export default Flip;
