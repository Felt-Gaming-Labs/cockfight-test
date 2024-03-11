// src/games/Flip/Cockfight.tsx

import React, { useEffect, useRef } from "react";
import { TextureLoader } from "three";
import { useLoader, useFrame } from "@react-three/fiber";

// Define the paths to your rooster images and outcome gifs
const TEXTURE_WHITE_ROOSTER = "/images/whitecock.png";
const TEXTURE_BLACK_ROOSTER = "/images/blackcock.png";
const WIN_WHITE_ROOSTER_GIF = "/images/whitecockwins.gif";
const LOSS_WHITE_ROOSTER_GIF = "/images/whitecockloss.gif";
const WIN_BLACK_ROOSTER_GIF = "/images/blackcockwins.gif";
const LOSS_BLACK_ROOSTER_GIF = "/images/blackcockloss.gif";

// This component will decide which texture to show based on the game's state
function RoosterTextures({ result, flipping }: { result: string; flipping: boolean }) {
  // Load textures for static images and outcome gifs
  const [whiteRooster, blackRooster, whiteWin, whiteLoss, blackWin, blackLoss] = useLoader(TextureLoader, [
    TEXTURE_WHITE_ROOSTER,
    TEXTURE_BLACK_ROOSTER,
    WIN_WHITE_ROOSTER_GIF,
    LOSS_WHITE_ROOSTER_GIF,
    WIN_BLACK_ROOSTER_GIF,
    LOSS_BLACK_ROOSTER_GIF,
  ]);

  // Decide which texture to use
  let texture;
  switch(result) {
    case "whiteWin":
      texture = whiteWin;
      break;
    case "whiteLoss":
      texture = whiteLoss;
      break;
    case "blackWin":
      texture = blackWin;
      break;
    case "blackLoss":
      texture = blackLoss;
      break;
    case "white":
      texture = whiteRooster;
      break;
    case "black":
    default:
      texture = blackRooster;
      break;
  }

  return (
    <mesh>
      <planeGeometry args={[1.3, 1.3]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

interface CockfightProps {
  flipping: boolean;
  result: string; // Updated to use string type for more outcomes
}

export function Cockfight({ flipping, result }: CockfightProps) {
  const group = useRef<Group | null>(null);

  // Use `useFrame` to add some flipping animation if you want
  useFrame((state, dt) => {
    // Animation logic here if desired
    // For simplicity, this example will not include complex flipping logic
  });

  return (
    <group ref={group}>
      <RoosterTextures result={result} flipping={flipping} />
    </group>
  );
}
