import React, { useState, useEffect, useRef } from "react";
import Canvas from "./components/Canvas";
import JetImageSrc from "./assets/images/jet.png";
import BackgroundImageSrc from "./assets/images/canvas.jpg";

//hooks
import { useImage } from "./components/hooks/useImage";
import { useWindowDimensions } from "./components/hooks/useWindowDimensions";

//images
import PlanetImageOne from "./assets/images/13.png";
import PlanetImageTwo from "./assets/images/16.png";
import PlanetImageThree from "./assets/images/21.png";

import GalaxyImageOne from "./assets/images/18.png";
import StarsImage from "./assets/images/Stars.png";

import MoonImageTwo from "./assets/images/16.png";

import CloudsOne from "./assets/images/Clouds1.png";
import CloudsTwo from "./assets/images/Clouds2.png";
import AirBalloonOne from "./assets/images/AirBalloon1.png";
import AirBalloonTwo from "./assets/images/AirBalloon2.png";
import SatelliteOne from "./assets/images/Satellite0.png";
import SatelliteTwo from "./assets/images/Satellite1.png";

//sprites
import ParachuteSprite from "./assets/images/Parachute1.png";
import ParachuteSpriteJson from "./assets/data/Parachute1.json";

import CommetSprite from "./assets/images/Comet.png";
import CommetSpriteJson from "./assets/data/Comet.json";

import BlueSpaceman from "./assets/images/Spaceman0.png";
import BlueSpacemanJson from "./assets/data/Spaceman0.json";

import { SpriteFrames } from "./components/types";
import "./App.css";

const App: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [backgroundType, setBackgroundType] = useState("initial"); // 'initial', 'gradient'
  const [isGradientScrolling, setIsGradientScrolling] = useState(false);
  const [gradientScrollPosition, setGradientScrollPosition] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startAnimationTime = useRef<number>(Date.now());
  const imageObjects = useRef(new Map());
  const [sprites, setSprites] = useState([
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 800,
      y: 100,
      minScroll: 100,
      maxScroll: 500,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 1000,
      y: -300,
      minScroll: 300,
      maxScroll: 600,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 1400,
      y: -300,
      minScroll: 300,
      maxScroll: 800,
      currentFrameIndex: 0,
    },
  ]);

  const [images, setImages] = useState([
    {
      url: CloudsOne,
      x: 0,
      y: 300,
      minScroll: 0,
      maxScroll: 1000,
    },
    {
      url: CloudsOne,
      x: 0,
      y: 300,
      minScroll: 0,
      maxScroll: 1000,
    },
    {
      url: AirBalloonOne,
      x: 700,
      y: -400,
      minScroll: 400,
      maxScroll: 1000,
    },
  ]);

  const dimensions = useWindowDimensions();
  const { screenWidth, screenHeight } = dimensions;
  const diagonalLength = Math.sqrt(screenWidth ** 2 + screenHeight ** 2) * 5;

  //Load images
  const backgroundImage = useImage(BackgroundImageSrc);
  const jetImage = useImage(JetImageSrc);

  const drawBackground = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    dimensions: { screenWidth: number; screenHeight: number }
  ) => {
    if (image.complete) {
      ctx.drawImage(
        image,
        0,
        0,
        dimensions.screenWidth,
        dimensions.screenHeight
      );
    }
  };

  const drawJet = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    dimensions: { screenWidth: number; screenHeight: number }
  ) => {
    if (image.complete) {
      const jetX = dimensions.screenWidth * 0.1;
      let jetY = dimensions.screenHeight * 0.85 - image.height / 2;
      const jetWidth = Math.max(dimensions.screenWidth / 10, 70);
      const jetHeight = (image.height / image.width) * jetWidth;
      if (jetY + jetHeight > dimensions.screenWidth) {
        jetY = dimensions.screenWidth - jetHeight;
      }
      ctx.drawImage(image, jetX, jetY, jetWidth, jetHeight);
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    // Clear the canvas
    ctx.clearRect(0, 0, screenWidth, screenHeight);

    if (backgroundType === "initial") {
      // Draw the initial background image and jet
      drawBackground(ctx, backgroundImage, dimensions);
      drawJet(ctx, jetImage, dimensions);
    } else {
      const gradient = ctx.createLinearGradient(
        0,
        screenHeight,
        diagonalLength,
        screenHeight - diagonalLength
      );

      gradient.addColorStop(0, "#A1757F");
      gradient.addColorStop(0.2, "#4860A3");
      gradient.addColorStop(0.4, "#293F6A");
      gradient.addColorStop(0.6, "#162144");
      gradient.addColorStop(0.8, "#151523");
      gradient.addColorStop(1.0, "#151523");

      ctx.fillStyle = gradient;

      const offsetX = gradientScrollPosition % diagonalLength;

      const offsetY = gradientScrollPosition % diagonalLength;

      //ctx.save();

      ctx.translate(-offsetX, offsetY);
      ctx.fillRect(
        0,
        screenHeight,
        diagonalLength,
        screenHeight - diagonalLength
      );

     // ctx.restore();
      images.forEach((img) => {
        if (
          gradientScrollPosition >= img.minScroll &&
          gradientScrollPosition <= img.maxScroll
        ) {
          const image = imageObjects.current.get(img.url);
          if (image) {
            ctx.drawImage(image, img.x - offsetX, img.y + offsetY);
          }
        }
      });

      sprites.forEach((sprite) => {
        if (
          gradientScrollPosition >= sprite.minScroll &&
          gradientScrollPosition <= sprite.maxScroll
        ) {
          const frameKey = sprite.animation[sprite.currentFrameIndex];
          const frame = sprite.frames[frameKey].frame;
          const spriteImage = imageObjects.current.get(sprite.url);
          if (spriteImage) {
            ctx.drawImage(
              spriteImage,
              frame.x,
              frame.y,
              frame.w,
              frame.h,
              sprite.x - offsetX,
              sprite.y + offsetY,
              frame.w,
              frame.h
            );
          }
        }
      });
    }
  };


  const updateAnimation = () => {
    if (!isRunning) return;

    const now = Date.now();
    const elapsedTime = (now - startAnimationTime.current) / 1000;
    // console.log("🚀 ~ updateAnimation ~ elapsedTime:", elapsedTime);

    // After 2 seconds, change the background to 'gradient'
    if (elapsedTime > 2) {
      setIsGradientScrolling(true);
      setBackgroundType("gradient");
    } else {
      setGradientScrollPosition(0);
      setBackgroundType("initial");
      setIsGradientScrolling(false);
    }

    // Call draw function again to update the canvas
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    draw(ctx);

    animationRef.current = requestAnimationFrame(updateAnimation);
  };

  useEffect(() => {
    if (isRunning) {
      startAnimationTime.current = Date.now();
      animationRef.current = requestAnimationFrame(updateAnimation);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (isGradientScrolling) {
      const scrollInterval = setInterval(() => {
        setGradientScrollPosition((prevPosition) => {
          // Stop incrementing scroll position when the last color comes into view
          if (prevPosition >= diagonalLength * 0.6) {
            clearInterval(scrollInterval);
            return prevPosition;
          }

          return prevPosition + 1;
        });
      }, 5);
      return () => clearInterval(scrollInterval);
    }
  }, [isGradientScrolling]);
  

  const toggleAnimation = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="App">
      <div>
        {" "}
        <Canvas draw={draw} width={screenWidth} height={screenHeight} />
      </div>

      <div>
        <button onClick={toggleAnimation}>
          {isRunning ? "Stop Animation" : "Start Animation"}
        </button>{" "}
      </div>
    </div>
  );
};

export default App;
