// src/components/sections/Header.tsx

import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useUserBalance,
} from "gamba-react-ui-v2";
import React, { useState } from "react";

import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import TokenSelect from "../ui/TokenSelect";
import { UserButton } from "../ui/UserButton";

export default function Header() {
  const pool = useCurrentPool();
  const balance = useUserBalance();
  const [bonusHelp, setBonusHelp] = useState(false);
  const [jackpotHelp, setJackpotHelp] = useState(false);

  return (
    <>
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>You have a bonus!</h1>
          <p>
            You have{" "}
            <b>
              <TokenValue amount={balance.bonusBalance} />
            </b>{" "}
            worth of free plays. This bonus will be applied automatically when
            you play.
          </p>
        </Modal>
      )}
      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot</h1>
          <p>
            There&apos;s{" "}
            <strong className="text-purple-400">
              <TokenValue amount={pool.jackpotBalance} />
            </strong>{" "}
            in the Jackpot.
          </p>
          <p>
            The Jackpot is a prize pool that grows with every bet made. As the
            Jackpot grows, so does your chance of winning. Once a winner is
            selected, the value of the Jackpot resets and grows from there until
            a new winner is selected.
          </p>
          <GambaUi.Button main>
            <a
              href={`https://explorer.gamba.so/pool/${pool.publicKey.toString()}`}
              target="_blank"
              rel="noreferrer"
            >
              View Pool
            </a>
          </GambaUi.Button>
        </Modal>
      )}
      <div className="flex items-center justify-between w-full p-2.5 bg-gray-900 fixed top-0 left-0 z-50 backdrop-blur-[20px]">
        <div className="flex gap-5 items-center">
          <Link href="/" passHref>
            <div className="h-9 m-0 cursor-pointer">
              <img alt="Gamba logo" src="/logo.svg" className="h-full" />
            </div>
          </Link>
        </div>
        <div className="max-sm:text-xs max-sm:gap-1 flex gap-2.5 items-center relative">
          {pool.jackpotBalance > 0 && (
            <button
              onClick={() => setJackpotHelp(true)}
              className="hidden md:flex all-unset cursor-pointer text-[#003c00] rounded-lg bg-[#03ffa4] px-2.5 py-0.5 text-xs uppercase font-bold transition-colors duration-200 hover:bg-white"
            >
              <TokenValue amount={pool.jackpotBalance} />
            </button>
          )}
          {balance.bonusBalance > 0 && (
            <button
              onClick={() => setBonusHelp(true)}
              className="hidden md:flex all-unset cursor-pointer text-[#003c00] rounded-lg bg-[#03ffa4] px-2.5 py-0.5 text-xs uppercase font-bold transition-colors duration-200 hover:bg-white"
            >
              +<TokenValue amount={balance.bonusBalance} />
            </button>
          )}
          <TokenSelect />
          <UserButton />
        </div>
      </div>
    </>
  );
}
