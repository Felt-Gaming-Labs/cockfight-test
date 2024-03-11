# Gamba Nextjs

![screencapture-localhost-3000-2024-02-25-12_46_48](https://github.com/BankkRoll/Gamba-V2-Next.js/assets/106103625/c7c8d0d4-459b-4cc6-a31e-da2ac84b4306)

> This is a forked and rewritten repo from the [gamba platform](https://github.com/gamba-labs/platform).

A demo frontend featuring multiple casino games built on Gamba.

Simply provide your own wallet address to the `<Gamba />` provider and start collecting fees on every bet made on your platform.

## Rewritten in Next.js

This version of the Gamba Demo has been rewritten using Next.js instead of Vite.

## Quick Setup

To get started with the Gamba Demo, follow these steps:

1. **Fork and Clone the Repository**

   ```
   git clone https://github.com/BankkRoll/Gamba-V2-Next.js.git
   cd Gamba-V2-Next.js
   ```

2. **Install Dependencies**

   Run the following command to install the necessary dependencies:

   ```
   npm install
   ```

3. **Configure the Config and Environment Variables**

   Rename the `.env.example` file to `.env` and update the variables to match your environment.

   ```
   NEXT_PUBLIC_RPC_ENDPOINT=<Your RPC Endpoint>
   ```

   Edit the [config.ts](./config.ts) and configure all your info

   ```
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
   ```

   To add a custom token to your platform, Update/Add to the following section with your custom token's details:

   ```
   // List of tokens supported by this platform
      export const TOKENS: Record<string, TokenMetadata> = {
         "000000000000000000000000000000000000000000": {
            mint: new PublicKey("000000000000000000000000000000000"),
            symbol: "TOKEN_SYMBOL",
            name: "Token Name",
            image: "URL_to_Token_Image",
            decimals: Token_Decimals,
            baseWager: Base_Wager_Amount,
         }
      };
   ```

4. **Run the Application**

Start the development server:

```
npm run dev
```

Visit `http://localhost:3000` in your browser to view the app.

## Additional Information

- **Contributing**: We welcome contributions! If you have improvements or fixes, please submit a pull request and include details about your changes.
- **Acknowledgments**: Special thanks to the original [gamba platform](https://github.com/gamba-labs/platform) for the inspiration behind this project.

### License

This project is licensed under the [MIT License](LICENSE).
