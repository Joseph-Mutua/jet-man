import React, { useRef, useState, useEffect } from "react";

//images
import PlanetImageOne from "../assets/images/13.png";
import PlanetImageTwo from "../assets/images/16.png";
import PlanetImageThree from "../assets/images/21.png";

import GalaxyImageOne from "../assets/images/18.png";
import StarsImage from "../assets/images/Stars.png";

import MoonImageTwo from "../assets/images/16.png";


import CloudsOne from "../assets/images/Clouds1.png";
import CloudsTwo from "../assets/images/Clouds2.png";
import AirBalloonOne from "../assets/images/AirBalloon1.png";
import AirBalloonTwo from "../assets/images/AirBalloon2.png";
import SatelliteOne from "../assets/images/Satellite0.png";
import SatelliteTwo from "../assets/images/Satellite1.png";

//sprites
import ParachuteSprite from "../assets/images/Parachute1.png";
import ParachuteSpriteJson from "../assets/data/Parachute1.json";

import CommetSprite from "../assets/images/Comet.png";
import CommetSpriteJson from "../assets/data/Comet.json";

import BlueSpaceman from "../assets/images/Spaceman0.png";
import BlueSpacemanJson from "../assets/data/Spaceman0.json";

const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjects = useRef(new Map<string, HTMLImageElement>());
  const animationRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);

  // Example sprite setup, adjust as needed
  const [sprites, setSprites] = useState([
    // Define your sprites here, including their animation speed if necessary
    // Example sprite definition
    {
      url: "path/to/your/sprite.png", // Update this path
      frames: [{ x: 0, y: 0, width: 100, height: 100 }], // Define frame coordinates and size
      currentFrameIndex: 0,
      animationSpeed: 100, // Milliseconds per frame
      lastUpdate: Date.now(),
    },
    // Add more sprites as needed
  ]);

  // Load images into imageObjects map
  useEffect(() => {
    sprites.forEach((sprite) => {
      if (!imageObjects.current.has(sprite.url)) {
        const img = new Image();
        img.src = sprite.url;
        img.onload = () => {
          imageObjects.current.set(sprite.url, img);
        };
      }
    });
  }, [sprites]);

  const updateSprites = (timestamp: number) => {
    if (!lastFrameTimeRef.current) lastFrameTimeRef.current = timestamp;
    const deltaTime = timestamp - lastFrameTimeRef.current;

    // Update sprite frames based on deltaTime and each sprite's animationSpeed
    setSprites((currentSprites) =>
      currentSprites.map((sprite) => {
        const timeSinceLastUpdate = timestamp - sprite.lastUpdate;
        if (timeSinceLastUpdate > sprite.animationSpeed) {
          return {
            ...sprite,
            currentFrameIndex:
              (sprite.currentFrameIndex + 1) % sprite.frames.length,
            lastUpdate: timestamp,
          };
        }
        return sprite;
      })
    );

    lastFrameTimeRef.current = timestamp;
    animationRef.current = requestAnimationFrame(updateSprites);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(updateSprites);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Render function for the canvas
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sprites
    sprites.forEach((sprite) => {
      const spriteImg = imageObjects.current.get(sprite.url);
      if (!spriteImg) return;
      const frame = sprite.frames[sprite.currentFrameIndex];
      ctx.drawImage(
        spriteImg,
        frame.x,
        frame.y,
        frame.width,
        frame.height,
        100,
        100,
        frame.width,
        frame.height
      );
    });
  };

  // Use an effect to call renderCanvas whenever sprites change
  useEffect(() => {
    renderCanvas();
  }, [sprites]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
};

export default BackgroundCanvas;
