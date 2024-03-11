// src/components/sections/TokenSelect.tsx
import {
  GambaPlatformContext,
  GambaUi,
  TokenValue,
  useCurrentToken,
  useTokenList,
  useUserBalance,
} from "gamba-react-ui-v2";
import React, { useContext, useState } from "react";

import { Dropdown } from "@/components/ui/Dropdown";
import { PublicKey } from "@solana/web3.js";

export default function TokenSelect() {
  const [visible, setVisible] = useState(false);
  const context = useContext(GambaPlatformContext);
  const selectedToken = useCurrentToken();
  const balance = useUserBalance();
  const tokenList = useTokenList();

  const setToken = (token: PublicKey) => {
    context.setToken(token);
    setVisible(false);
  };

  const click = () => {
    setVisible(!visible);
  };

  return (
    <div className="relative">
      <GambaUi.Button onClick={click}>
        {selectedToken && (
          <div className="min-w-32 max-sm:text-xs whitespace-nowrap flex items-center gap-2.5">
            <img
              className="w-5 h-5 rounded-full"
              src={selectedToken.image}
              alt="Token"
            />
            <TokenValue amount={balance.balance} />
          </div>
        )}
      </GambaUi.Button>
      <Dropdown visible={visible}>
        {tokenList.map((x, i) => (
          <button
            className="flex items-center gap-2.5 px-2.5 py-2 text-left hover:bg-gray-800 rounded-lg"
            onClick={() => setToken(x.mint)}
            key={i}
          >
            <img
              className="w-5 h-5 rounded-full"
              src={x.image}
              alt={x.symbol}
            />
            {x.symbol}
          </button>
        ))}
      </Dropdown>
    </div>
  );
}
