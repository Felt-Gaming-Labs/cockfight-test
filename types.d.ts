// src/types.d.ts

// config.ts
export interface TokenMetadata {
  mint: PublicKey;
  name: string;
  symbol: string;
  image: string;
  decimals: number;
  baseWager: number;
  poolAuthority?: PublicKey;
  usdPrice?: number;
}
