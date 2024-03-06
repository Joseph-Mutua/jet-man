import React, { useRef, useEffect } from "react";

interface CanvasProps {
  draw: (context: CanvasRenderingContext2D) => void;
  width: number;
  height: number;
}

const Canvas: React.FC<CanvasProps> = ({ draw, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context) {
      draw(context);
    }
  }, [draw, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ maxWidth: "100%" }}
    />
  );
};

export default Canvas;
