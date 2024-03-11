// src/components/sections/UserButton.tsx

import { GambaUi } from "gamba-react-ui-v2";
import { Modal } from "./Modal";
import React from "react";
import { truncateString } from "@/utils/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletAddress } from "gamba-react-v2";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

function ConnectedButton() {
  const [modal, setModal] = React.useState(false);
  const wallet = useWallet();
  const ref = React.useRef<HTMLDivElement>(null!);
  const address = useWalletAddress();

  return (
    <>
      {modal && (
        <Modal onClose={() => setModal(false)}>
          <h1>{truncateString(address.toBase58(), 6, 3)}</h1>
          <GambaUi.Button onClick={() => wallet.disconnect()}>
            Disconnect
          </GambaUi.Button>
        </Modal>
      )}
      <div className="max-sm:text-xs whitespace-nowrap" ref={ref}>
        <GambaUi.Button onClick={() => setModal(true)}>
          <div className="flex gap-2 items-center">
            <img src={wallet.wallet?.adapter.icon} width={20} />
            {truncateString(address.toBase58(), 3)}
          </div>
        </GambaUi.Button>
      </div>
    </>
  );
}

export function UserButton() {
  const walletModal = useWalletModal();
  const wallet = useWallet();

  const connect = () => {
    if (wallet.wallet) {
      wallet.connect();
    } else {
      walletModal.setVisible(true);
    }
  };

  return (
    <>
      {wallet.connected ? (
        <ConnectedButton />
      ) : (
        <GambaUi.Button onClick={connect}>
          {wallet.connecting ? "Connecting" : "Connect"}
        </GambaUi.Button>
      )}
    </>
  );
}
