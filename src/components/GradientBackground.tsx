import React, { useRef, useState, useEffect, useCallback } from "react";
import MoonImage from "../assets/images/11.png";
import BlueSpaceman from "../assets/images/Spaceman0.png";
import BlueSpacemanJson from "../assets/data/Spaceman0.json";
import SkyOne from "../assets/images/Clouds1.png";
import Airport from "../assets/images/Airport.png";
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
      url: MoonImage,
      x: 1000,
      y: -200,
      minScroll: 200,
      maxScroll: 900,
    },
    {
      url: MoonImage,
      x: 7900,
      y: -6500,
      minScroll: 6500,
      maxScroll: 7800,
    },

    // {
    //   url: SkyOne,
    //   x: 600,
    //   y: 200,
    //   minScroll: 100,
    //   maxScroll: 900,
    // },
  ]);

  // Include the spaceman sprite in the images array if needed, or handle separately
  const spacemanSprite = {
    url: BlueSpaceman,
    frames: BlueSpacemanJson.frames as SpriteFrames,
    animation: BlueSpacemanJson.animations.Spaceman0,
    x: 600, // Example x position
    y: 400, // Example y position
    minScroll: 100, // Example min scroll position for animation start
    maxScroll: 200, // Example max scroll position for animation end
  };

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const diagonalLength = Math.sqrt(screenWidth ** 2 + screenHeight ** 2) * 20;

  const startScrolling = () => {
    setIsScrolling(true);
  };

  const stopScrolling = () => {
    setIsScrolling(false);
    setScrollPosition(0);
  };


  const animateSprite = useCallback(() => {
    if (
      scrollPosition >= spacemanSprite.minScroll &&
      scrollPosition <= spacemanSprite.maxScroll
    ) {
      setCurrentFrameIndex(
        (prevIndex) => (prevIndex + 1) % spacemanSprite.animation.length
      );
    }
    animationRef.current = requestAnimationFrame(animateSprite);
  }, [
    scrollPosition,
    spacemanSprite.minScroll,
    spacemanSprite.maxScroll,
    spacemanSprite.animation.length,
  ]); // Add any dependencies here

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animateSprite);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animateSprite]); 

  useEffect(() => {
    // Preload images and sprite sheet
    [...images, spacemanSprite].forEach((img) => {
      const image = new Image();
      image.src = img.url;
      image.onload = () => {
        imageObjects.current.set(img.url, image);
      };
    });
  }, [images]);

  useEffect(() => {
    if (isScrolling) {
      const scrollInterval = setInterval(() => {
        setScrollPosition((prevPosition) => {
          // Stop incrementing scroll position when the last color comes into view
          if (prevPosition >= diagonalLength * 0.9) {
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

    // Clear the previous drawing
    ctx.clearRect(0, 0, screenWidth, screenHeight);

    // Create a gradient that spans the diagonal length of the canvas
    const gradient = ctx.createLinearGradient(
      0,
      screenHeight,
      diagonalLength,
      screenHeight - diagonalLength
    );

    gradient.addColorStop(0, "#A1757F");
    gradient.addColorStop(0.05, "#A58BAA");
    gradient.addColorStop(0.1, "#806279");
    gradient.addColorStop(0.15, "#6D79B6");
    gradient.addColorStop(0.2, "#4860A3");
    gradient.addColorStop(0.25, "#436AB5");
    gradient.addColorStop(0.3, "#4262A8");

    gradient.addColorStop(0.35, "#5373B7");
    gradient.addColorStop(0.4, "#293F6A");
    gradient.addColorStop(0.45, "#395B9E");
    gradient.addColorStop(0.5, "#1E3764");
    gradient.addColorStop(0.55, "#37518A");
    gradient.addColorStop(0.6, "#1B305D");
    gradient.addColorStop(0.65, "#1B2D56");

    gradient.addColorStop(0.7, "#182247");
    gradient.addColorStop(0.75, "#191D39");
    gradient.addColorStop(0.8, "#162144");
    gradient.addColorStop(0.85, "#2A3045");
    gradient.addColorStop(0.9, "#161B33");
    gradient.addColorStop(0.95, "#121526");
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
        //console.log("🚀 ~ images.forEach ~ scrollPosition:", scrollPosition);
        const image = imageObjects.current.get(img.url);
        if (image) {
          // console.log(
          //   "img x",
          //   img.x,
          //   "offset x",
          //   offsetX,
          //   "img y",
          //   img.y,
          //   "offset y",
          //   offsetY,
          //   "scroll position",
          //   scrollPosition,
          //   "min scroll",
          //   img.minScroll,
          //   "Max Scroll",
          //   img.maxScroll,
          //   "Scroll Position",
          //   scrollPosition
          // );
          ctx.drawImage(image, img.x - offsetX, img.y + offsetY);
        }
      }
    });


        // Draw the animated spaceman sprite
    if (scrollPosition >= spacemanSprite.minScroll && scrollPosition <= spacemanSprite.maxScroll) {
      const frameKey = spacemanSprite.animation[currentFrameIndex];
      const frame = spacemanSprite.frames[frameKey].frame;
      const spriteImage = imageObjects.current.get(spacemanSprite.url);
      if (spriteImage) {
        ctx.drawImage(
          spriteImage,
          frame.x,
          frame.y,
          frame.w,
          frame.h,
          spacemanSprite.x, // Adjust position as needed
          spacemanSprite.y, // Adjust position as needed
          frame.w,
          frame.h
        );
      }
    }
  }, [scrollPosition, images, currentFrameIndex]);


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
