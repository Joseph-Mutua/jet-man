import { useEffect, useState } from "react";

export const useWindowDimensions = () => {
  const baseWidth = 1920; // Base design width
  const baseHeight = 1080; // Base design height
  const maxWidth = window.innerWidth * 0.9;
  const aspectRatio = 16 / 9;

  // Initialize dimensions with scale
  const [dimensions, setDimensions] = useState({
    screenWidth: window.innerWidth,
    screenHeight: window.innerWidth / aspectRatio,
    aspectRatio: 16 / 9,
    scale: Math.min(
      window.innerWidth / baseWidth,
      window.innerWidth / aspectRatio / baseHeight
    ), // Uniform scaling factor
  });

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = Math.min(window.innerWidth, maxWidth);
      const screenHeight = screenWidth / aspectRatio;
      const scale = Math.min(
        screenWidth / baseWidth,
        screenHeight / baseHeight
      ); // Recalculate uniform scaling factor

      setDimensions({ screenWidth, screenHeight, aspectRatio, scale });
    };

    // A slight delay in applying resize might not be necessary unless you have a specific reason for it.
    window.addEventListener("resize", handleResize);

    // Initial resize adjustment
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
};
