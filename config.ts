// config.ts

import { GambaStandardTokens, TokenMeta } from "gamba-react-ui-v2";

import { PublicKey } from "@solana/web3.js";

// Solana address you wish to receive fees
export const PLATFORM_CREATOR_ADDRESS = new PublicKey(
  "GzzWXXDjLD4FDwDkWB5sARjC2aaLSfCQDjx3dmpoTY7K",
);

// Platform URL - Appears in ShareModal
export const PLATFORM_SHARABLE_URL = "play-gamba.vercel.app";

// Toggle all live events acrossed gamba toast
export const LIVE_EVENT_TOAST = true;

// RPC - Can be configured in .env
export const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_RPC_ENDPOINT ?? "https://api.mainnet-beta.solana.com";

// Platform explorer URL - Appears in welcome banner
export const PLATFORM_EXPLORER_URL = `https://explorer.gamba.so/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`;

// List of tokens supported by this platform
export const TOKENS: TokenMeta[] = [
  GambaStandardTokens.sol,
  GambaStandardTokens.usdc,
  {
    mint: new PublicKey("AZsHEMXd36Bj1EMNXhowJajpUXzrKcK57wW4ZGXVa7yR"),
    symbol: "GUAC",
    name: "Guacamole",
    image:
      "https://bafkreiccbqs4jty2yjvuxp5x7gzgepquvv657ttauaqgxfhxghuz5us54u.ipfs.nftstorage.link/",
    decimals: 5,
    baseWager: 2000000 * 1e5,
  },
  {
    mint: new PublicKey("ApxJeC9Pv5YbS3Ataq2kAfNeFLafEADVmC49czvFAP93"),
    symbol: "SOLVEGAS",
    name: "SolVegas",
    image:
      "https://bafybeiglvnotba6yf2rrie3ytr3qo5awn4h4vdukzscyc7xa5snvelqr6a.ipfs.nftstorage.link/",
    decimals: 9,
    baseWager: 10000 * 1e9,
  },
  {
    mint: new PublicKey("8CofuxeTuXjrZSMahW9wYkedVoNcvwua6aJeM1UhxuLh"),
    symbol: "TSTCOIN",
    name: "TESTERCOIN",
    image: "https://i.ibb.co/SvfbhLy/imageedit-37-6175591894.png",
    decimals: 9,
    baseWager: 1 * 1e9,
  },
  // Uncomment and configure this part if you have a custom SPL token you want to add
  // {
  //   mint: new PublicKey("Your_Token's_PublicKey"),
  //   symbol: 'Your_Token_Symbol',
  //   name: 'Your_Token_Name',
  //   image: "Your_Token_Image_URL",
  //   decimals: Your_Token_Decimals,
  //   baseWager: Your_Base_Wager_Value,
  // }
];
