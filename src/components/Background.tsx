import React, { useRef, useState, useEffect } from "react";

const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const startScrolling = () => {
    setIsScrolling(true);
  };

  const stopScrolling = () => {
    setIsScrolling(false);
    setScrollPosition(0); // Reset the scroll position
  };

  useEffect(() => {
    if (isScrolling) {
      const scrollInterval = setInterval(() => {
        setScrollPosition((prevPosition) => prevPosition + 1);
      }, 5);
      return () => clearInterval(scrollInterval);
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

    // Clear the previous drawing
    ctx.clearRect(0, 0, screenWidth, screenHeight);

    // Create a gradient that spans the diagonal length of the canvas
    const gradient = ctx.createLinearGradient(
      0,
      0,
      diagonalLength,
      diagonalLength
    );
    // Define gradient stops
    // gradient.addColorStop(0, '#F9B4C4');
    // gradient.addColorStop(0.2, '#B0B8F9');
    // gradient.addColorStop(0.4, '#A5B9FE');
    // gradient.addColorStop(0.6, '#99B3FE');
    // gradient.addColorStop(0.8, '#7C86B6');
    // gradient.addColorStop(1, '#52628D');

    gradient.addColorStop(0, "red");
    gradient.addColorStop(0.2, "blue");
    gradient.addColorStop(0.4, "green");
    gradient.addColorStop(0.6, "yellow");
    gradient.addColorStop(0.8, "orange");
    gradient.addColorStop(1, "black");

    ctx.fillStyle = gradient;

    // Calculate the current position of the gradient background
    const offsetX = scrollPosition % diagonalLength;
    const offsetY = scrollPosition % diagonalLength;

    // Draw the gradient background at the current scroll position
    ctx.save();
    ctx.translate(-offsetX, -offsetY);
    ctx.fillRect(0, 0, diagonalLength, diagonalLength);
    //  ctx.fillRect(diagonalLength, diagonalLength, 0, 0);
    ctx.restore();
  }, [scrollPosition]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <button onClick={startScrolling}>Start</button>
      <button onClick={stopScrolling}>Stop</button>
    </div>
  );
};

export default BackgroundCanvas;
