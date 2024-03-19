/** @jsxImportSource @emotion/react */

import React, { useRef, useState, useEffect } from "react";

interface MultiplierCanvasProps {
  currentGameOdds: string;
  targetGameOdds: string | null;
  screenWidth: number;
  screenHeight: number;
}

const MultiplierCanvas: React.FC<MultiplierCanvasProps> = ({
  currentGameOdds,
  targetGameOdds,
  screenWidth,
  screenHeight,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;


    const baseFontSize = Math.max(Math.min(screenWidth / 20, 80), 16);
    ctx.font = `${baseFontSize}px Arial bold`;
    ctx.fillStyle =
      parseFloat(currentGameOdds) >= parseFloat(targetGameOdds || "0")
        ? "red"
        : "green";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";


    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillText(
        currentGameOdds + " X",
        canvas.width / 2,
        canvas.height / 2 - 20
      );

      if (targetGameOdds) {
        const targetFontSize = Math.max(Math.min(screenWidth / 25, 56), 16);
        ctx.font = `${targetFontSize}px Arial`;
        ctx.fillStyle = "black";
        ctx.fillText(targetGameOdds, canvas.width / 2, canvas.height / 2 + 40);

      }
    };

    render();
  }, [currentGameOdds, targetGameOdds, screenWidth, screenHeight]);

  return (
    <canvas ref={canvasRef} width={screenWidth / 2} height={screenHeight / 2} />
  );
};

export default MultiplierCanvas;
