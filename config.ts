// config.ts

import { PublicKey } from "@solana/web3.js";
import { TokenMetadata } from "./types";
import { useTokenMeta } from "gamba-react-ui-v2";

// Solana address you wish to receive fees
export const PLATFORM_CREATOR_ADDRESS = new PublicKey(
  "GzzWXXDjLD4FDwDkWB5sARjC2aaLSfCQDjx3dmpoTY7K",
);

// Creator fee (in %)
export const PLATFORM_CREATOR_FEE = 0.05; // 5% (5/100 = 0.05)

// Jackpot fee (in %)
export const PLATFORM_JACKPOT_FEE = 0.01; // 1% (1/100 = 0.01)

// Platform URL - Appears in ShareModal
export const PLATFORM_SHARABLE_URL = "play-gamba.vercel.app";

// Toggle all live events acrossed gamba toast (true = on, false = off)
export const LIVE_EVENT_TOAST = true;

// Platform explorer URL - Appears in welcome banner (can be changed for if you have cusotm explorer)
export const PLATFORM_EXPLORER_URL = `https://explorer.gamba.so/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`;

// List of tokens supported by this platform
export const TOKENS: Record<string, TokenMetadata> = {
  // SOL
  So11111111111111111111111111111111111111112: {
    mint: new PublicKey("So11111111111111111111111111111111111111112"),
    symbol: "SOL",
    name: "Solana",
    image:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    decimals: 9,
    baseWager: 0.01e9,
  },
  // USDC
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    mint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    symbol: "USDC",
    name: "USD Coin",
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAM1BMVEUAAAAgcM8oeMcndckndcondco1fs1ChtFQj9RdmNdroNt4qd6TuuW81O/X5vXl7vn///9JjkDLAAAABXRSTlMAECDg8En8Fj4AAAFcSURBVFjDvZfRQsMgDEXp2minzuX/v9YXnaXJvbktzjw1QA6BQkhagzLbQ5Z2VCyRQXMdMRuR5fzsohcmyKg9IZgso/Y5YT/mfausLyWh73d3Z3okBPMI2CEw4OYI4J8QEMe6JU51rdw+bjwl0MXCPsU+ahlhxvMnakIofh9ZRQqgB2o3ZKrsDfzP3oXCX7oq5oBvhbnAdxwQMkDmwO/nFbiwA4B5SNfmFPWjriLAHg689aM+8JUwd/dbANQxCKxBPLRnATlFAsCDJAN6xCmA2Vpfh1bv+n0UEO/5YcCNARYcPyUNXaZOI6G6MYB2G8V44HU82M2zyhGpsZ9VxUQxKhuNytiF+l24jL5M30/bggnpquLzfPZ1ThIEFshC74QzDMfmXiVJKBA6tS/TtJ+2VyVPNAw4lqrSBiVZJqqWrj+zYHhWyfMHRZeAmAYLR6l2nZD15d+K7wjBo74A10JdTYrgUpYAAAAASUVORK5CYII=",
    decimals: 6,
    baseWager: 1e6,
  },
  // GUAC
  AZsHEMXd36Bj1EMNXhowJajpUXzrKcK57wW4ZGXVa7yR: {
    mint: new PublicKey("AZsHEMXd36Bj1EMNXhowJajpUXzrKcK57wW4ZGXVa7yR"),
    symbol: "GUAC",
    name: "Guacamole",
    image:
      "https://bafkreiccbqs4jty2yjvuxp5x7gzgepquvv657ttauaqgxfhxghuz5us54u.ipfs.nftstorage.link/",
    decimals: 5,
    baseWager: 2000000e5,
  },
  // You can easily add more tokens here
  //
  // "000000000000000000000000000000000000000000": {
  //   mint: new PublicKey("000000000000000000000000000000000"),
  //   symbol: "",
  //   name: "",
  //   image: "",
  //   decimals: 9,
  //   baseWager: 1e9,
  // },
  //
};

// Fallback handler to utilize the tokens dictionary for metadata lookup
useTokenMeta.setFallbackHandler((mint) => {
  const mintAddress = mint.toString();
  const token = TOKENS[mintAddress];
  if (token) {
    return {
      ...token,
      mint: new PublicKey(token.mint),
    };
  }
  return undefined;
});
