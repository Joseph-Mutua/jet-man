import React, { useRef, useEffect } from "react";

const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const backgroundImage = new Image();
  backgroundImage.src = "./assets/images/canvas.jpg";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !backgroundImage.complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.8;

    const draw = (scrollOffset: number, isVerticalScroll: boolean) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackgroundImage(ctx, scrollOffset, canvas, isVerticalScroll);
    };

    const drawBackgroundImage = (
      ctx: CanvasRenderingContext2D,
      position: number,
      canvas: HTMLCanvasElement,
      isVerticalScroll: boolean
    ) => {
      if (!isVerticalScroll) {
        // Horizontal scrolling logic ...
      } else {
        // Vertical scrolling logic ...
      }
    };

    draw(0, false); // Initial draw

    // Event listener for later updating scrollOffset if needed
  }, []);

  return <canvas ref={canvasRef} />;
};

export default BackgroundCanvas;
