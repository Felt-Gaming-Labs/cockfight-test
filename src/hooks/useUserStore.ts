// src/hooks/useUserStore.ts

import { StoreApi, create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface UserStore {
  agreedToTerms: boolean;
  newcomer: boolean;
  /** A list of games played. The first time a game is opened we display instructions. */
  gamesPlayed: string[];
  set: StoreApi<UserStore>["setState"];
}

/**
 * Store client settings here
 */
export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      agreedToTerms: false,
      newcomer: true,
      gamesPlayed: [],
      set,
    }),
    {
      name: "user",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
