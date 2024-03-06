import React, {useEffect, useState} from 'react'

export const useWindowDimensions = () => {
  const maxWidth = window.innerWidth * 0.9;
  const aspectRatio = 16 / 9;
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerWidth / aspectRatio,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(window.innerWidth, maxWidth);
      const height = width / aspectRatio;
      setDimensions({ width, height });
    };
    setTimeout(handleResize, 100);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
};
