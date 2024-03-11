import React, { useRef, useState, useEffect, useCallback } from "react";

import "../App.css";

//images

import AirportImage from "../assets/images/Airport.png";
import RoadImage from "../assets/images/Road.png";
import JetImage from "../assets/images/jet.png";
import Fence from "../assets/images/Fence.png";
import GarageImage from "../assets/images/Garage.png";

import PlanetImageOne from "../assets/images/13.png";
import PlanetImageTwo from "../assets/images/16.png";
import PlanetImageThree from "../assets/images/21.png";

import GalaxyImageOne from "../assets/images/18.png";
import StarsImage from "../assets/images/Stars.png";

import MoonImageTwo from "../assets/images/16.png";

//import AirportImageTwo from "../assets/images/"

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

import { ImageSprite, SpriteFrames } from "./types";
import { useWindowDimensions } from "./hooks/useWindowDimensions";

const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const imageObjects = useRef(new Map());
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const animationRef = useRef<number>();
  const [jetPhase, setJetPhase] = useState("horizontal"); // 'horizontal' or 'angled'

  const dimensions = useWindowDimensions();
  const { screenWidth, screenHeight, scale } = dimensions;
  const diagonalLength = Math.sqrt(screenWidth ** 2 + screenHeight ** 2) * 5;

  const moveJetIntervalRef = useRef();
  const tiltJetTimeoutRef = useRef();

  const moveJetRef = useRef<number | null>(null);
  const moveJetAngledRef = useRef<number | null>(null);
  //const moveJetAngledRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const angleTimeoutRef = useRef<number | null>(null);

  const defaultZIndex = 1;

  const [images, setImages] = useState<ImageSprite[]>([
    {
      url: RoadImage,
      x: 0,
      y: 960,
      minScroll: 0,
      maxScroll: 3000,
      zIndex: 1,
    },
    {
      url: JetImage,
      x: 100,
      y: 1000,
      minScroll: 0,
      maxScroll: 3000,
      zIndex: 100,
    },
    {
      url: AirportImage,
      x: 10,
      y: 660,
      minScroll: 0,
      maxScroll: 3000,
      zIndex: 10,
    },

    {
      url: CloudsOne,
      x: 0,
      y: 630,
      minScroll: 0,
      maxScroll: 3000,
    },

    {
      url: Fence,
      x: 0,
      y: 880,
      minScroll: 0,
      maxScroll: 3000,
    },

    {
      url: GarageImage,
      x: 1100,
      y: 880,
      minScroll: 0,
      maxScroll: 3000,
    },

    {
      url: AirBalloonOne,
      x: 700,
      y: -400,
      minScroll: 400,
      maxScroll: 1000,
    },
    {
      url: AirBalloonOne,
      x: 1200,
      y: -400,
      minScroll: 500,
      maxScroll: 1000,
    },
    {
      url: AirBalloonTwo,
      x: 1600,
      y: -600,
      minScroll: 600,
      maxScroll: 1200,
    },
    {
      url: AirBalloonOne,
      x: 2200,
      y: -900,
      minScroll: 900,
      maxScroll: 1400,
    },
    {
      url: AirBalloonTwo,
      x: 2500,
      y: -1100,
      minScroll: 1000,
      maxScroll: 1600,
    },
    {
      url: AirBalloonOne,
      x: 2700,
      y: -1600,
      minScroll: 1700,
      maxScroll: 2200,
    },
    {
      url: AirBalloonOne,
      x: 2450,
      y: -1200,
      minScroll: 1250,
      maxScroll: 1600,
    },

    {
      url: AirBalloonTwo,
      x: 1950,
      y: -1250,
      minScroll: 1250,
      maxScroll: 1600,
    },
    {
      url: AirBalloonTwo,
      x: 2000,
      y: -1350,
      minScroll: 1350,
      maxScroll: 1750,
    },

    {
      url: CloudsTwo,
      x: 2000,
      y: -1700,
      minScroll: 2000,
      maxScroll: 2500,
    },
    {
      url: CloudsTwo,
      x: 2200,
      y: -2100,
      minScroll: 3000,
      maxScroll: 3500,
    },
    {
      url: SatelliteOne,
      x: 3500,
      y: -3000,
      minScroll: 3050,
      maxScroll: 3500,
    },
    {
      url: SatelliteOne,
      x: 4500,
      y: -3400,
      minScroll: 3500,
      maxScroll: 4000,
    },
    {
      url: SatelliteTwo,
      x: 4500,
      y: -3600,
      minScroll: 3700,
      maxScroll: 3900,
    },
    {
      url: PlanetImageOne,
      x: 4500,
      y: -4100,
      minScroll: 3800,
      maxScroll: 4500,
    },
    {
      url: PlanetImageTwo,
      x: 5500,
      y: -4400,
      minScroll: 3900,
      maxScroll: 4650,
    },
    {
      url: PlanetImageThree,
      x: 5700,
      y: -4000,
      minScroll: 4100,
      maxScroll: 4900,
    },
    {
      url: GalaxyImageOne,
      x: 6000,
      y: -5000,
      minScroll: 5000,
      maxScroll: 5600,
    },
    {
      url: StarsImage,
      x: 6000,
      y: -5500,
      minScroll: 5500,
      maxScroll: 10600,
    },
  ]);

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

    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 1400,
      y: -300,
      minScroll: 300,
      maxScroll: 700,
      currentFrameIndex: 0,
    },

    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 1800,
      y: -650,
      minScroll: 650,
      maxScroll: 1050,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 1800,
      y: -750,
      minScroll: 700,
      maxScroll: 1000,
      currentFrameIndex: 0,
    },

    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2000,
      y: -650,
      minScroll: 700,
      maxScroll: 1000,
      currentFrameIndex: 0,
    },

    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 1200,
      y: -650,
      minScroll: 750,
      maxScroll: 1050,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 1800,
      y: -700,
      minScroll: 800,
      maxScroll: 1200,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 1900,
      y: -700,
      minScroll: 800,
      maxScroll: 1300,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2000,
      y: -800,
      minScroll: 900,
      maxScroll: 1400,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2000,
      y: -800,
      minScroll: 900,
      maxScroll: 1500,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2400,
      y: -800,
      minScroll: 900,
      maxScroll: 1600,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2300,
      y: -750,
      minScroll: 950,
      maxScroll: 1650,
      currentFrameIndex: 0,
    },

    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2300,
      y: -900,
      minScroll: 1000,
      maxScroll: 1700,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2300,
      y: -950,
      minScroll: 1100,
      maxScroll: 1200,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2400,
      y: -1000,
      minScroll: 1100,
      maxScroll: 1200,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2400,
      y: -1000,
      minScroll: 1150,
      maxScroll: 1250,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2400,
      y: -1000,
      minScroll: 1150,
      maxScroll: 1250,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2450,
      y: -1000,
      minScroll: 1150,
      maxScroll: 1650,
      currentFrameIndex: 0,
    },

    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2550,
      y: -1250,
      minScroll: 1300,
      maxScroll: 1400,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2600,
      y: -1250,
      minScroll: 1300,
      maxScroll: 1550,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2650,
      y: -1300,
      minScroll: 1350,
      maxScroll: 1500,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2700,
      y: -1300,
      minScroll: 1350,
      maxScroll: 1700,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2750,
      y: -1350,
      minScroll: 1400,
      maxScroll: 1700,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2750,
      y: -1350,
      minScroll: 1400,
      maxScroll: 1700,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 3200,
      y: -2400,
      minScroll: 2500,
      maxScroll: 2700,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 3900,
      y: -2900,
      minScroll: 3000,
      maxScroll: 3200,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 3950,
      y: -3450,
      minScroll: 3500,
      maxScroll: 3750,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 3950,
      y: -3450,
      minScroll: 3550,
      maxScroll: 3700,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 4050,
      y: -3600,
      minScroll: 3650,
      maxScroll: 3700,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 4900,
      y: -3900,
      minScroll: 4000,
      maxScroll: 4200,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 4900,
      y: -3900,
      minScroll: 4000,
      maxScroll: 4200,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 4950,
      y: -3950,
      minScroll: 4050,
      maxScroll: 4250,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 5000,
      y: -4000,
      minScroll: 4100,
      maxScroll: 4300,
      currentFrameIndex: 0,
    },

    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 5100,
      y: -4100,
      minScroll: 4200,
      maxScroll: 4700,
      currentFrameIndex: 0,
    },

    {
      url: CommetSprite,
      frames: CommetSpriteJson.frames as SpriteFrames,
      animation: CommetSpriteJson.animations.Comet,
      x: 5300,
      y: -4500,
      minScroll: 4600,
      maxScroll: 4800,
      currentFrameIndex: 0,
    },

    {
      url: CommetSprite,
      frames: CommetSpriteJson.frames as SpriteFrames,
      animation: CommetSpriteJson.animations.Comet,
      x: 4300,
      y: -4500,
      minScroll: 4600,
      maxScroll: 4800,
      currentFrameIndex: 0,
    },

    {
      url: CommetSprite,
      frames: CommetSpriteJson.frames as SpriteFrames,
      animation: CommetSpriteJson.animations.Comet,
      x: 5000,
      y: -4550,
      minScroll: 4650,
      maxScroll: 4800,
      currentFrameIndex: 0,
    },

    {
      url: CommetSprite,
      frames: CommetSpriteJson.frames as SpriteFrames,
      animation: CommetSpriteJson.animations.Comet,
      x: 5200,
      y: -4600,
      minScroll: 4700,
      maxScroll: 4900,
      currentFrameIndex: 0,
    },

    {
      url: CommetSprite,
      frames: CommetSpriteJson.frames as SpriteFrames,
      animation: CommetSpriteJson.animations.Comet,
      x: 5500,
      y: -4900,
      minScroll: 5000,
      maxScroll: 5200,
      currentFrameIndex: 0,
    },
  ]);

  const startScrolling = () => {
    let jetIndex = images.findIndex((img) => img.url === JetImage);

    // Clear previous intervals and timeouts if any
    if (moveJetRef.current) clearInterval(moveJetRef.current);
    if (moveJetAngledRef.current) clearInterval(moveJetAngledRef.current);
    if (angleTimeoutRef.current) clearTimeout(angleTimeoutRef.current);

    // Start moving the jet horizontally
    moveJetRef.current = setInterval(() => {
      setImages((currentImages) =>
        currentImages.map((img, index) => {
          if (index === jetIndex) {
            return { ...img, x: img.x + 5 }; // Move horizontally
          }
          return img;
        })
      );
    }, 10) as unknown as number;

    // After 2 seconds, start moving the jet at a 45-degree angle
    // After 2 seconds, start moving the jet at a 45-degree angle
    angleTimeoutRef.current = setTimeout(() => {
      if (moveJetRef.current !== null) {
        clearInterval(moveJetRef.current);
      }
      moveJetRef.current = null; // Clear the horizontal movement interval

      // Fetch the current position of the jet
      const jetIndex = images.findIndex((img) => img.url === JetImage);
      const jet = images[jetIndex];

      setJetPhase("angled"); // Update jet phase to angled
      setIsScrolling(true); // Begin scrolling background

      // The rest of your angled movement setup
      moveJetAngledRef.current = setInterval(() => {
        // Your angled movement code here
      }, 10) as unknown as number;

      // After an additional 2 seconds, stop the jet
      setTimeout(() => {
        if (moveJetAngledRef.current !== null) {
          clearInterval(moveJetAngledRef.current);
          moveJetAngledRef.current = null;
        }
      }, 1500) as unknown as number;
    }, 1500) as unknown as number;
  };
  const stopScrolling = () => {
    setIsScrolling(false);
    setJetPhase("horizontal");
    setScrollPosition(0);

    const jetIndex = images.findIndex((img) => img.url === JetImage);

    setImages((currentImages) =>
      currentImages.map((img, index) => {
        if (index === jetIndex) {
          return { ...img, x: 100, y: 1000 };
        }
        return img;
      })
    );

    // Clear the intervals and timeouts
    clearInterval(moveJetIntervalRef.current);
    clearTimeout(tiltJetTimeoutRef.current);

    // Optionally reset refs to null
    moveJetIntervalRef.current = undefined;

    tiltJetTimeoutRef.current = undefined;
  };

  const animateSprite = useCallback(() => {
    setSprites((currentSprites) =>
      currentSprites.map((sprite) => {
        if (
          scrollPosition >= sprite.minScroll &&
          scrollPosition <= sprite.maxScroll
        ) {
          return {
            ...sprite,
            currentFrameIndex:
              (sprite.currentFrameIndex + 1) % sprite.animation.length,
          };
        }
        return sprite;
      })
    );
    animationRef.current = requestAnimationFrame(animateSprite);
  }, [scrollPosition]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animateSprite);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animateSprite]);

  useEffect(() => {
    [...images, ...sprites].forEach((img) => {
      const image = new Image();
      image.src = img.url;
      image.onload = () => {
        imageObjects.current.set(img.url, image);
      };
    });
  }, [images, sprites]);

  useEffect(() => {
    if (isScrolling) {
      const scrollInterval = setInterval(() => {
        setScrollPosition((prevPosition) => {
          if (prevPosition >= diagonalLength * 0.6) {
            clearInterval(scrollInterval);
            return prevPosition;
          }

          return prevPosition + 1;
        });
      }, 5);
      return () => clearInterval(scrollInterval);
    }
  }, [isScrolling]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = screenWidth;
    canvas.height = screenHeight;

    ctx.clearRect(0, 0, screenWidth, screenHeight);

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

    const drawableObjects = [...images].sort(
      (a, b) => (a.zIndex || defaultZIndex) - (b.zIndex || defaultZIndex)
    );
    drawableObjects.forEach((obj) => {
      const image = imageObjects.current.get(obj.url);

      //const image = imageObjects.current.get(obj.url);
      if (image) {
        let scaledWidth = image.width * scale;
        let scaledHeight = image.height * scale;
        let scaledX, scaledY;

        if (image.src === JetImage) {
          // Calculate scaled dimensions and positions
          scaledX = (obj.x + offsetX) * scale;
          scaledY = (obj.y - offsetY) * scale;

          // Adjust position if needed
          if (scaledY <= screenHeight * 0.25) {
            scaledX = screenWidth * 0.78;
            scaledY = screenHeight * 0.25;
          }

          ctx.save(); // Save the current context state

          // Translate to the center of the image for rotation
          ctx.translate(scaledX + scaledWidth / 2, scaledY + scaledHeight / 2);

          // Check if jetPhase is "angled" and apply rotation
          if (jetPhase === "angled") {
            ctx.rotate(-(45 * Math.PI) / 180); // Rotate by 45 degrees
          }

          ctx.drawImage(
            image,
            -scaledWidth / 2,
            -scaledHeight / 2,
            scaledWidth,
            scaledHeight
          );

          ctx.restore();
        } else if (
          scrollPosition >= obj.minScroll &&
          scrollPosition <= obj.maxScroll
        ) {
          scaledX = (obj.x - offsetX) * scale;
          scaledY = (obj.y + offsetY) * scale;
          ctx.drawImage(image, scaledX, scaledY, scaledWidth, scaledHeight);
        }
      }
    });

    sprites.forEach((sprite) => {
      if (
        scrollPosition >= sprite.minScroll &&
        scrollPosition <= sprite.maxScroll
      ) {
        const frameKey = sprite.animation[sprite.currentFrameIndex];
        const frame = sprite.frames[frameKey].frame;
        const spriteImage = imageObjects.current.get(sprite.url);
        if (spriteImage) {
          // Scale positions and frame dimensions
          const scaledX = (sprite.x - offsetX) * scale;
          const scaledY = (sprite.y + offsetY) * scale;
          const scaledFrameWidth = frame.w * scale;
          const scaledFrameHeight = frame.h * scale;

          ctx.drawImage(
            spriteImage,
            frame.x,
            frame.y,
            frame.w,
            frame.h,
            scaledX,
            scaledY,
            scaledFrameWidth,
            scaledFrameHeight
          );
        }
      }
    });
  }, [scrollPosition, images, sprites, currentFrameIndex]);

  return (
    <div className="App">
      <canvas
        ref={canvasRef}
        width={screenWidth}
        height={screenHeight}
        style={{ maxWidth: "100%" }}
      />
      <div>
        {" "}
        <button onClick={startScrolling}>Start</button>
        <button onClick={stopScrolling}>Stop</button>
      </div>
    </div>
  );
};

export default BackgroundCanvas;
