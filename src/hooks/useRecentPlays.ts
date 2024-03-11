// src/components/sections/RecentPlays/useRecentPlays.ts

import React, { useMemo, useState } from "react";
import { useGambaEventListener, useGambaEvents } from "gamba-react-v2";

import { GambaTransaction } from "gamba-core-v2";
import { PLATFORM_CREATOR_ADDRESS } from "../../config";
import { useRouter } from "next/router";

export function useRecentPlays(platformOnly = false) {
  const router = useRouter();

  const eventFilter = platformOnly ? { address: PLATFORM_CREATOR_ADDRESS } : {};
  const previousEvents = useGambaEvents("GameSettled", eventFilter);

  const [newEvents, setNewEvents] = useState<GambaTransaction<"GameSettled">[]>(
    [],
  );

  useGambaEventListener(
    "GameSettled",
    (event: GambaTransaction<"GameSettled">) => {
      if (
        platformOnly &&
        !event.data.creator.equals(PLATFORM_CREATOR_ADDRESS)
      ) {
        return;
      }

      const eventExists = newEvents.some(
        (e) => e.signature === event.signature,
      );

      if (!eventExists) {
        setNewEvents((prevEvents) => [event, ...prevEvents]);
      }
    },
    [router.pathname, platformOnly],
  );

  const combinedEvents = useMemo(() => {
    const allEvents = [...newEvents, ...previousEvents];
    const uniqueEvents = allEvents.filter(
      (event, index, self) =>
        index === self.findIndex((e) => e.signature === event.signature),
    );
    return uniqueEvents.sort((a, b) => b.time - a.time);
  }, [newEvents, previousEvents]);

  return combinedEvents;
}
