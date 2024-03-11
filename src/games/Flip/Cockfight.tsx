// src/games/Flip/Cockfight.tsx

import React from 'react';

// Define paths to your images and gifs
const TEXTURE_WHITE_ROOSTER = "/images/whitecock.png";
const TEXTURE_BLACK_ROOSTER = "/images/blackcock.png";
const WIN_WHITE_ROOSTER_GIF = "/images/whitecockwins.gif";
const LOSS_WHITE_ROOSTER_GIF = "/images/whitecockloss.gif";
const WIN_BLACK_ROOSTER_GIF = "/images/blackcockwins.gif";
const LOSS_BLACK_ROOSTER_GIF = "/images/blackcockloss.gif";

interface CockfightProps {
  result: string; // This will determine which image or gif to show
}

export const Cockfight: React.FC<CockfightProps> = ({ result }) => {
  // Decide which image or gif to display based on the result
  let imagePath = "";
  switch (result) {
    case "whiteWin":
      imagePath = WIN_WHITE_ROOSTER_GIF;
      break;
    case "whiteLoss":
      imagePath = LOSS_WHITE_ROOSTER_GIF;
      break;
    case "blackWin":
      imagePath = WIN_BLACK_ROOSTER_GIF;
      break;
    case "blackLoss":
      imagePath = LOSS_BLACK_ROOSTER_GIF;
      break;
    case "white":
      imagePath = TEXTURE_WHITE_ROOSTER;
      break;
    case "black":
      imagePath = TEXTURE_BLACK_ROOSTER;
      break;
    default:
      imagePath = TEXTURE_WHITE_ROOSTER; // Default or a placeholder image
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <img src={imagePath} alt="Cockfight Result" style={{ maxWidth: '100%', height: 'auto' }} />
    </div>
  );
};
