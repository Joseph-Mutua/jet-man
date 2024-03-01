import React, { useRef, useState, useEffect } from "react";

interface BackgroundCanvasProps {
  isScrolling: boolean;
}

const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ isScrolling }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (isScrolling) {
      const scrollInterval = setInterval(() => {
        setScrollPosition((prevPosition) => prevPosition + 1);
      }, 5);
      return () => clearInterval(scrollInterval);
    } else {
      // Optionally reset the scroll position when scrolling stops
      setScrollPosition(0);
    }
  }, [isScrolling]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const diagonalLength = Math.sqrt(screenWidth ** 2 + screenHeight ** 2) * 5;
    canvas.width = screenWidth;
    canvas.height = screenHeight;

    ctx.clearRect(0, 0, screenWidth, screenHeight);

    const gradient = ctx.createLinearGradient(
      0,
      screenHeight,
      diagonalLength,
      screenHeight - diagonalLength
    );
    gradient.addColorStop(0, "red");
    gradient.addColorStop(0.2, "blue");
    gradient.addColorStop(0.4, "green");
    gradient.addColorStop(0.6, "yellow");
    gradient.addColorStop(0.8, "orange");
    gradient.addColorStop(1, "black");

    ctx.fillStyle = gradient;

    const offsetX = scrollPosition % diagonalLength;
    const offsetY = scrollPosition % diagonalLength;

    ctx.save();
    ctx.translate(-offsetX, offsetY);
    ctx.fillRect(
      0,
      screenHeight,
      diagonalLength,
      screenHeight - diagonalLength
    );
    ctx.restore();
  }, [scrollPosition]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};

export default BackgroundCanvas;
