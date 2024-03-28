import React, { useRef, useEffect } from "react";
import LoaderImage from "../assets/images/Loader.png";
import LoaderSpriteJson from "../assets/data/Loader.json";
import { Frame } from "./types";

interface SpriteAnimationProps {
  imageUrl: string; // URL to the sprite image
  animationData: any; // Structure of the animation data (can be more specific)
}


function SpriteAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const frameIndex = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const image = new Image();
    image.src = LoaderImage;

    // Assuming LoaderSpriteJson has a structure similar to what the error message describes
    const frames = Object.values(LoaderSpriteJson.frames).map(
      (frameData) => ({
        ...frameData,
        frame: {
          x: frameData.frame.x,
          y: frameData.frame.y,
          width: frameData.frame.w, // Adjust according to your JSON structure
          height: frameData.frame.h,
        },
      })
    );

    let lastTime = 0;

    const animate = (time: number) => {
      if (!lastTime) {
        lastTime = time;
      }
      
      const deltaTime = time - lastTime;

      if (deltaTime > 100) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const frame = frames[frameIndex.current % frames.length];
        ctx.drawImage(
          image,
          frame.frame.x,
          frame.frame.y,
          frame.frame.width,
          frame.frame.height,
          0,
          0,
          frame.frame.width,
          frame.frame.height
        );

        frameIndex.current++;
        lastTime = time;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    image.onload = () => {
      requestRef.current = requestAnimationFrame(animate);
    };

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} width={900} height={900}></canvas>;
}

export default SpriteAnimation;
