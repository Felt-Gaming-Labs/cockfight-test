import React, { useEffect, useState } from "react";

import { GambaTransaction } from "gamba-core-v2";
import { GambaUi } from "gamba-react-ui-v2";
import { PLATFORM_EXPLORER_URL } from "../../../../config";
import { RecentPlay } from "@/utils/RecentPlay";
import { ShareModal } from "./ShareModal";
import { TimeDiff } from "@/utils/TimeDiff";
import { useRecentPlays } from "../../../hooks/useRecentPlays";

export default function RecentPlays() {
  const [platformOnly, setPlatformOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const events = useRecentPlays(platformOnly);
  const [selectedGame, setSelectedGame] =
    useState<GambaTransaction<"GameSettled"> | null>(null);

  const togglePlatformView = () => {
    setLoading(true);
    setPlatformOnly(!platformOnly);
  };

  useEffect(() => {
    setSelectedGame(null);
    setLoading(true);
  }, [platformOnly]);

  useEffect(() => {
    setLoading(events.length === 0);
  }, [events]);

  return (
    <div className="w-full relative flex flex-col gap-2.5">
      <div className="mb-4 flex justify-center">
        <div className="flex items-center gap-4">
          <GambaUi.Button
            onClick={() => setPlatformOnly(true)}
            main={platformOnly}
          >
            Platform Only
          </GambaUi.Button>

          <GambaUi.Switch
            checked={!platformOnly}
            onChange={togglePlatformView}
          />

          <GambaUi.Button
            onClick={() => setPlatformOnly(false)}
            main={!platformOnly}
          >
            All Gamba Events
          </GambaUi.Button>
        </div>
      </div>

      {selectedGame && (
        <ShareModal
          event={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
      {events.length === 0 ||
        (loading &&
          Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="h-10 w-full rounded-lg animate-Skeleton bg-gray-300"
            ></div>
          )))}
      {!loading &&
        events.map((tx, index) => (
          <button
            key={tx.signature + "-" + index}
            onClick={() => setSelectedGame(tx)}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0f121b] hover:bg-[#131724] justify-between"
          >
            <div className="flex items-center gap-2">
              <RecentPlay event={tx} />
            </div>
            <TimeDiff time={tx.time} />
          </button>
        ))}
      <GambaUi.Button
        main
        onClick={() =>
          window.open(
            platformOnly ? PLATFORM_EXPLORER_URL : "https://explorer.gamba.so/",
          )
        }
      >
        {platformOnly ? "🚀 Platform Explorer" : "🚀 Gamba Explorer"}
      </GambaUi.Button>
    </div>
  );
}
