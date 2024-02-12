import React, { useRef, useEffect } from "react";

interface Props {
  jetImage: string;
  airportImage: string;
  roadSurfaceImage: string;
}

const GameCanvas: React.FC<Props> = ({
  jetImage,
  airportImage,
  roadSurfaceImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let requestId: number;

  const draw = (ctx: CanvasRenderingContext2D, planeY: number) => {
    const background = new Image();
    background.src = airportImage;
    const roadSurface = new Image();
    roadSurface.src = roadSurfaceImage;
    const jet = new Image();
    jet.src = jetImage;

    background.onload = () => {
      ctx.drawImage(background, 0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(
        roadSurface,
        0,
        ctx.canvas.height - roadSurface.height,
        ctx.canvas.width,
        roadSurface.height
      );
      ctx.drawImage(jet, ctx.canvas.width / 2 - jet.width / 2, planeY);
    };
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext("2d");
    if (!context) return;

    let planeY = canvas.height - 100; // Initial position of the plane
    const animate = () => {
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      planeY -= 0.5; // Speed of the plane taking off
      draw(context, planeY);
      requestId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default GameCanvas;
