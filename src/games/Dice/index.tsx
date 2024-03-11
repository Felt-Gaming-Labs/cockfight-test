// src/games/Dice/index.tsx

import { Container, Result, RollUnder, Stats } from "./styles";
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useSound,
  useWagerInput,
} from "gamba-react-ui-v2";

import { BPS_PER_WHOLE } from "gamba-core-v2";
import React from "react";
import Slider from "./Slider";
import { useGamba } from "gamba-react-v2";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const SOUND_PLAY = "/games/dice/play.mp3";
const SOUND_LOSE = "/games/dice/lose.mp3";
const SOUND_WIN = "/games/dice/win.mp3";
const SOUND_TICK = "/games/dice/tick.mp3";

const DICE_SIDES = 100;

export const outcomes = (
  length: number,
  multiplierCallback: (resultIndex: number) => number | undefined,
) => {
  const payoutArray = Array.from({ length }).map((_, resultIndex) => {
    const payout = multiplierCallback(resultIndex) ?? 0;
    return payout;
  });
  const totalValue = payoutArray.reduce((p, x) => p + x, 0);
  return payoutArray.map(
    (x) =>
      Number(
        (BigInt(x * BPS_PER_WHOLE) / BigInt(totalValue || 1)) * BigInt(length),
      ) / BPS_PER_WHOLE,
  );
};

export default function Dice() {
  const gamba = useGamba();
  const [wager, setWager] = useWagerInput();
  const pool = useCurrentPool();
  const [resultIndex, setResultIndex] = React.useState(-1);
  const [rollUnderIndex, setRollUnderIndex] = React.useState(
    Math.floor(DICE_SIDES / 2),
  );
  const sounds = useSound({
    win: SOUND_WIN,
    play: SOUND_PLAY,
    lose: SOUND_LOSE,
    tick: SOUND_TICK,
  });
  const walletModal = useWalletModal();
  const wallet = useWallet();

  const connect = () => {
    if (wallet.wallet) {
      wallet.connect();
    } else {
      walletModal.setVisible(true);
    }
  };

  const multiplier =
    Number(BigInt(DICE_SIDES * BPS_PER_WHOLE) / BigInt(rollUnderIndex)) /
    BPS_PER_WHOLE;

  const bet = React.useMemo(
    () =>
      outcomes(DICE_SIDES, (resultIndex) => {
        if (resultIndex < rollUnderIndex) {
          return DICE_SIDES - rollUnderIndex;
        }
      }),
    [rollUnderIndex],
  );

  const maxWin = multiplier * wager;

  const game = GambaUi.useGame();

  const play = async () => {
    sounds.play("play");

    await game.play({
      wager,
      bet,
    });

    const result = await game.result();

    setResultIndex(result.resultIndex);

    if (result.resultIndex < rollUnderIndex) {
      sounds.play("win");
    } else {
      sounds.play("lose");
    }
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        <GambaUi.Responsive>
          <Container>
            <RollUnder>
              <div>
                <div>{rollUnderIndex + 1}</div>
                <div>Roll Under</div>
              </div>
            </RollUnder>
            <Stats>
              <div>
                <div>{((rollUnderIndex / DICE_SIDES) * 100).toFixed(0)}%</div>
                <div>Win Chance</div>
              </div>
              <div>
                <div>{multiplier.toFixed(2)}x</div>
                <div>Multiplier</div>
              </div>
              <div>
                {maxWin > pool.maxPayout ? (
                  <div style={{ color: "red" }}>Too high</div>
                ) : (
                  <div>
                    <TokenValue suffix="" amount={maxWin} />
                  </div>
                )}
                <div>Payout</div>
              </div>
            </Stats>
            <div style={{ position: "relative" }}>
              {resultIndex > -1 && (
                <Result
                  style={{ left: `${(resultIndex / DICE_SIDES) * 100}%` }}
                >
                  <div key={resultIndex}>{resultIndex + 1}</div>
                </Result>
              )}
              <Slider
                disabled={gamba.isPlaying}
                range={[0, DICE_SIDES]}
                min={1}
                max={DICE_SIDES - 5}
                value={rollUnderIndex}
                onChange={(value) => {
                  setRollUnderIndex(value);
                  sounds.play("tick");
                }}
              />
            </div>
          </Container>
        </GambaUi.Responsive>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        {wallet.connected ? (
          <GambaUi.PlayButton onClick={play}>Roll</GambaUi.PlayButton>
        ) : (
          <GambaUi.Button main onClick={connect}>
            Play
          </GambaUi.Button>
        )}
      </GambaUi.Portal>
    </>
  );
}
