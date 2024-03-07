import {useEffect, useState} from 'react'

export const useWindowDimensions = () => {
  const maxWidth = window.innerWidth * 0.9;
  const aspectRatio = 16 / 9;
  const [dimensions, setDimensions] = useState({
    screenWidth: window.innerWidth,
    screenHeight: window.innerWidth / aspectRatio,
  });

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = Math.min(window.innerWidth, maxWidth);
      const screenHeight = screenWidth / aspectRatio;
      setDimensions({ screenWidth, screenHeight });
    };
    setTimeout(handleResize, 100);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
};
