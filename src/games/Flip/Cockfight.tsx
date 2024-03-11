// src/games/Flip/Cockfight.tsx

import React from 'react';

interface CockfightProps {
  result: string; // Result to determine which image/GIF to display
}

const Cockfight: React.FC<CockfightProps> = ({ result }) => {
  // Define paths to your images and gifs
  const TEXTURE_WHITE_ROOSTER = "/images/whitecock.png";
  const TEXTURE_BLACK_ROOSTER = "/images/blackcock.png";
  const WIN_WHITE_ROOSTER_GIF = "/images/whitecockwins.gif";
  const LOSS_WHITE_ROOSTER_GIF = "/images/whitecockloss.gif";
  const WIN_BLACK_ROOSTER_GIF = "/images/blackcockwins.gif";
  const LOSS_BLACK_ROOSTER_GIF = "/images/blackcockloss.gif";

  // Determine which image/GIF to display based on the result
  let imageToShow = TEXTURE_WHITE_ROOSTER; // Default image
  switch(result) {
    case "whiteWin":
      imageToShow = WIN_WHITE_ROOSTER_GIF;
      break;
    case "whiteLoss":
      imageToShow = LOSS_WHITE_ROOSTER_GIF;
      break;
    case "blackWin":
      imageToShow = WIN_BLACK_ROOSTER_GIF;
      break;
    case "blackLoss":
      imageToShow = LOSS_BLACK_ROOSTER_GIF;
      break;
    case "white":
      imageToShow = TEXTURE_WHITE_ROOSTER;
      break;
    case "black":
      imageToShow = TEXTURE_BLACK_ROOSTER;
      break;
    // Add more cases as needed
  }

  // Render the determined image/GIF
  return (
    <img src={imageToShow} alt="Cockfight Result" style={{ width: '100%', height: 'auto' }} />
  );
};

export default Cockfight;
