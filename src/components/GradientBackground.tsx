import React, { useRef, useState, useEffect, useCallback } from "react";

//images
import MoonImage from "../assets/images/11.png";
import BlueSpaceman from "../assets/images/Spaceman0.png";
import BlueSpacemanJson from "../assets/data/Spaceman0.json";
import CloudsOne from "../assets/images/Clouds1.png";
import CloudsTwo from "../assets/images/Clouds2.png";
import AirBalloonOne from "../assets/images/AirBalloon1.png";
import AirBalloonTwo from "../assets/images/AirBalloon2.png";
import SatelliteOne from "../assets/images/Satellite0.png";
import SatelliteTwo from "../assets/images/Satellite1.png";

//sprites
import ParachuteSprite from "../assets/images/Parachute1.png";
import ParachuteSpriteJson from "../assets/data/Parachute1.json";
import { SpriteFrames } from "./types";

const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const imageObjects = useRef(new Map());
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const animationRef = useRef<number>();

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
      x: 2300,
      y: -1000,
      minScroll: 1000,
      maxScroll: 1500,
    },
    {
      url: AirBalloonOne,
      x: 2100,
      y: -1100,
      minScroll: 1100,
      maxScroll: 1500,
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
    // {
    //   url: MoonImage,
    //   x: 1000,
    //   y: -200,
    //   minScroll: 200,
    //   maxScroll: 900,
    // },

    // {
    //   url: MoonImage,
    //   x: 7900,
    //   y: -6500,
    //   minScroll: 6500,
    //   maxScroll: 7800,
    // },

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
      url: CloudsTwo,
      x: 3700,
      y: -3500,
      minScroll: 3500,
      maxScroll: 4200,
    },

    // {
    //   url: SkyOne,
    //   x: 600,
    //   y: 200,
    //   minScroll: 100,
    //   maxScroll: 900,
    // },
  ]);

  const [sprites, setSprites] = useState([
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 800,
      y: 100,
      minScroll: 100,
      maxScroll: 600,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 1000,
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
      maxScroll: 850,
      currentFrameIndex: 0,
    },

    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 1800,
      y: -650,
      minScroll: 650,
      maxScroll: 1200,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 1800,
      y: -750,
      minScroll: 700,
      maxScroll: 1300,
      currentFrameIndex: 0,
    },

    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2000,
      y: -650,
      minScroll: 700,
      maxScroll: 1300,
      currentFrameIndex: 0,
    },

    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 1200,
      y: -650,
      minScroll: 750,
      maxScroll: 1250,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 1800,
      y: -700,
      minScroll: 800,
      maxScroll: 1350,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 1900,
      y: -700,
      minScroll: 800,
      maxScroll: 1250,
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
      maxScroll: 1400,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2400,
      y: -800,
      minScroll: 900,
      maxScroll: 1450,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2300,
      y: -750,
      minScroll: 950,
      maxScroll: 1550,
      currentFrameIndex: 0,
    },

    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2300,
      y: -900,
      minScroll: 1000,
      maxScroll: 1600,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2300,
      y: -950,
      minScroll: 1100,
      maxScroll: 1600,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2400,
      y: -1000,
      minScroll: 1100,
      maxScroll: 1600,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2400,
      y: -1000,
      minScroll: 1150,
      maxScroll: 1600,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2400,
      y: -1000,
      minScroll: 1150,
      maxScroll: 1600,
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
      maxScroll: 1650,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2600,
      y: -1250,
      minScroll: 1300,
      maxScroll: 1650,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 2650,
      y: -1300,
      minScroll: 1350,
      maxScroll: 1700,
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
      y: -2950,
      minScroll: 3050,
      maxScroll: 3250,
      currentFrameIndex: 0,
    },
    {
      url: ParachuteSprite,
      frames: ParachuteSpriteJson.frames as SpriteFrames,
      animation: ParachuteSpriteJson.animations.Parachute1,
      x: 4800,
      y: -3900,
      minScroll: 4000,
      maxScroll: 4200,
      currentFrameIndex: 0,
    },
    // {
    //   url: BlueSpaceman,
    //   frames: BlueSpacemanJson.frames as SpriteFrames,
    //   animation: BlueSpacemanJson.animations.Spaceman0,
    //   x: 600,
    //   y: 400,
    //   minScroll: 100,
    //   maxScroll: 200,
    //   currentFrameIndex: 0,
    // },
  ]);

  const screenWidth = window.innerWidth *0.8;
  const screenHeight = window.innerHeight * 0.8;
  const diagonalLength = Math.sqrt(screenWidth ** 2 + screenHeight ** 2) * 5;

  const startScrolling = () => {
    setIsScrolling(true);
  };

  const stopScrolling = () => {
    setIsScrolling(false);
    setScrollPosition(0);
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
          // Stop incrementing scroll position when the last color comes into view
          if (prevPosition >= diagonalLength * 0.7) {
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
    // gradient.addColorStop(0.05, "#A58BAA");
    // gradient.addColorStop(0.1, "#806279");
    // gradient.addColorStop(0.15, "#6D79B6");
    gradient.addColorStop(0.2, "#4860A3");
    // gradient.addColorStop(0.25, "#436AB5");
    //gradient.addColorStop(0.3, "#4262A8");

    // gradient.addColorStop(0.35, "#5373B7");
    gradient.addColorStop(0.4, "#293F6A");
    // gradient.addColorStop(0.45, "#395B9E");
    //gradient.addColorStop(0.5, "#1E3764");
    // gradient.addColorStop(0.55, "#37518A");
    gradient.addColorStop(0.6, "#162144");
    // gradient.addColorStop(0.65, "#1B2D56");

   // gradient.addColorStop(0.7, "#182247");
    // gradient.addColorStop(0.75, "#191D39");
    gradient.addColorStop(0.8, "#151523");
    // gradient.addColorStop(0.85, "#2A3045");
    //gradient.addColorStop(0.9, "#161B33");
    //gradient.addColorStop(0.95, "#121526");
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
    images.forEach((img) => {
      if (scrollPosition >= img.minScroll && scrollPosition <= img.maxScroll) {
        const image = imageObjects.current.get(img.url);
        if (image) {
          ctx.drawImage(image, img.x - offsetX, img.y + offsetY);
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
  }, [scrollPosition, images, sprites, currentFrameIndex]);

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
