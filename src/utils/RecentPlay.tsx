import { BPS_PER_WHOLE, GambaTransaction } from "gamba-core-v2";
import { TokenValue, useTokenMeta } from "gamba-react-ui-v2";

import { extractMetadata } from "@/utils/utils";

export function RecentPlay({
  event,
}: {
  event: GambaTransaction<"GameSettled">;
}) {
  const data = event.data;
  const token = useTokenMeta(data.tokenMint);

  const multiplier = data.bet[data.resultIndex.toNumber()] / BPS_PER_WHOLE;
  const wager = data.wager.toNumber();
  const payout = multiplier * wager;
  const profit = payout - wager;

  const { game } = extractMetadata(event);

  if (!game) {
    return null;
  }

  return (
    <>
      <img
        src={`/games/${game.id}/logo.png`}
        alt={`Splash for ${game.meta.name}`}
        width={64}
      />
      <div className="text-[#a079ff]">
        {`${data.user.toBase58().substring(0, 4)}...${data.user
          .toBase58()
          .slice(-4)}`}
      </div>
      <div className="hidden md:inline">{profit >= 0 ? " won " : " lost "}</div>
      <div
        className={`flex gap-2 items-center rounded-lg p-1 ${
          profit > 0 ? "bg-green-600" : "bg-white/10"
        }`}
      >
        <img src={token.image} width={24} className="rounded-full" />
        <TokenValue amount={Math.abs(profit)} mint={data.tokenMint} />
      </div>
      <div className="hidden md:flex flex-col">
        {profit > 0 && <div>({multiplier.toFixed(2)}x)</div>}
        {data.jackpotPayoutToUser.toNumber() > 0 && (
          <div className="animate-jackpotGradient flex gap-2 items-center text-black rounded-lg p-1">
            +
            <TokenValue
              mint={data.tokenMint}
              amount={data.jackpotPayoutToUser.toNumber()}
            />
          </div>
        )}
      </div>
    </>
  );
}
