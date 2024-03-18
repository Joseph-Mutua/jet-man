import { useEffect, useState } from "react";

export const useWindowDimensions = () => {
  const baseWidth = 1920; 
  const baseHeight = 1080; 
  const maxWidth = window.innerWidth * 0.9;
  const aspectRatio = 16 / 9;

  const [dimensions, setDimensions] = useState({
    screenWidth: window.innerWidth,
    screenHeight: window.innerWidth / aspectRatio,
    aspectRatio: 16 / 9,
    scale: Math.min(
      window.innerWidth / baseWidth,
       window.innerWidth / aspectRatio / baseHeight
    ),
  });

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = Math.min(window.innerWidth, maxWidth);
      const screenHeight = screenWidth / aspectRatio;
      const scale = Math.min(
        screenWidth / baseWidth,
        screenHeight / baseHeight
      );

      setDimensions({ screenWidth, screenHeight, aspectRatio, scale });
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [aspectRatio, maxWidth]);

  return dimensions;
};
