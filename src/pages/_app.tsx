// src/pages/_app.tsx
import "@/styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  LIVE_EVENT_TOAST,
  PLATFORM_CREATOR_ADDRESS,
  PLATFORM_CREATOR_FEE,
  PLATFORM_JACKPOT_FEE,
} from "../../config";

import { AppProps } from "next/app";
import Footer from "@/components/layout/Footer";
import { GAMES } from "../games";
import { GambaPlatformProvider } from "gamba-react-ui-v2";
import { GambaProvider } from "gamba-react-v2";
import GameToast from "@/hooks/useGameEvent";
import React from "react";
import { Toaster } from "sonner";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useDisclaimer } from "@/hooks/useDisclaimer";

function MyApp({ Component, pageProps }: AppProps) {
  const { showDisclaimer, DisclaimerModal } = useDisclaimer();
  const RPC_ENDPOINT =
    process.env.NEXT_PUBLIC_RPC_ENDPOINT ??
    "https://api.mainnet-beta.solana.com";

  return (
    <ConnectionProvider
      endpoint={RPC_ENDPOINT}
      config={{ commitment: "processed" }}
    >
      <WalletProvider autoConnect wallets={[]}>
        <WalletModalProvider>
          <GambaProvider>
            <GambaPlatformProvider
              creator={PLATFORM_CREATOR_ADDRESS}
              games={GAMES}
              defaultCreatorFee={PLATFORM_CREATOR_FEE}
              defaultJackpotFee={PLATFORM_JACKPOT_FEE}
            >
              <Component {...pageProps} />
              <Footer />
              <Toaster
                position="bottom-right"
                richColors
                toastOptions={{
                  style: { background: "#15151f" },
                }}
              />
              {LIVE_EVENT_TOAST && <GameToast />}
              {showDisclaimer && <DisclaimerModal />}
            </GambaPlatformProvider>
          </GambaProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
