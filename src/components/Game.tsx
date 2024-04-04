import React, { useRef, useState, useEffect, useMemo } from "react";
import "../App.css";

//Game
import { IGameState, RUNNING, WAITING, ENDED } from "../common/constants";

//background images
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

import CloudsOne from "../assets/images/Clouds1.png";
import CloudsTwo from "../assets/images/Clouds2.png";
import AirBalloonOne from "../assets/images/AirBalloon1.png";
import AirBalloonTwo from "../assets/images/AirBalloon2.png";
import SatelliteOne from "../assets/images/Satellite0.png";
import SatelliteTwo from "../assets/images/Satellite1.png";

//Flame Sprites
import FireOneSprite from "../assets/images/Fire1.png";
import FireOneSpriteJson from "../assets/data/Fire1.json";
const FireOneSheet = new Image();
FireOneSheet.src = FireOneSprite;

import FireTwoSprite from "../assets/images/Fire2.png";
import FireTwoSpriteJson from "../assets/data/Fire2.json";
const FireTwoSheet = new Image();
FireTwoSheet.src = FireTwoSprite;

import FireThreeSprite from "../assets/images/Fire3.png";
import FireThreeSpriteJson from "../assets/data/Fire3.json";
const FireThreeSheet = new Image();
FireThreeSheet.src = FireThreeSprite;

import FireFourSprite from "../assets/images/Fire4.png";
import FireFourSpriteJson from "../assets/data/Fire4.json";
const FireFourSheet = new Image();
FireFourSheet.src = FireFourSprite;

//Explosion Sprite
import BoomSprite from "../assets/images/Boom.png";
import BoomSpriteJson from "../assets/data/Boom.json";
const BoomSheet = new Image();
BoomSheet.src = BoomSprite;

//Loading sprites
import LoaderSprite from "../assets/images/Loader.png";
import LoaderSpriteJson from "../assets/data/Loader.json";

//Parachute
import ParachuteSprite from "../assets/images/Parachute2.png";

import { useWindowDimensions } from "./hooks/useWindowDimensions";

import { FireJson } from "./types";
import { generateTargetGameOdds as generateMultiplier } from "../utils/GenerateOdds";

const Game: React.FC = () => {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const waitingCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjects = useRef(new Map());
  const [scrollPosition, setScrollPosition] = useState(0);

  //Game States
  const [loadingAssetsComplete, setLoadingAssetsComplete] = useState(false);
  const { screenWidth, screenHeight, scale } = useWindowDimensions();

  const diagonalLength = Math.sqrt(screenWidth ** 2 + screenHeight ** 2) * 5;
  const offsetX = scrollPosition % diagonalLength;
  const offsetY = scrollPosition % diagonalLength;

  const defaultZIndex = 1;

  //Timer States
  const [gameState, setGameState] = useState<IGameState>(WAITING);
  const [elapsed, setElapsed] = useState(0);
  const [now, setNow] = useState<number>(Date.now());
  const [currentStateStartTime, setCurrentStateStartTime] = useState<number>(
    Date.now()
  );
  const [explosionStarted, setExplosionStarted] = useState(false);

  const targetMultiplier = useRef<string | null>(null);
  const currentMultiplier = Math.exp(0.00006 * elapsed).toFixed(2);

  const imageUrls = useMemo(
    () => [
      AirportImage,
      RoadImage,
      JetImage,
      Fence,
      GarageImage,
      PlanetImageOne,
      PlanetImageTwo,
      PlanetImageThree,
      GalaxyImageOne,
      StarsImage,
      CloudsOne,
      CloudsTwo,
      AirBalloonOne,
      AirBalloonTwo,
      SatelliteOne,
      SatelliteTwo,
    ],
    []
  );

  const spriteUrls = useMemo(
    () => [
      FireOneSprite,
      FireTwoSprite,
      FireThreeSprite,
      FireFourSprite,

      BoomSprite,
      LoaderSprite,
      ParachuteSprite,
    ],
    []
  );

  useEffect(() => {
    [...imageUrls, ...spriteUrls].forEach((url) => {
      const image = new Image();
      image.src = url;
      image.onload = () => {
        imageObjects.current.set(url, image);
      };
    });
    setLoadingAssetsComplete(true);
  }, [imageUrls, spriteUrls]);

  const stillImageObjects = useMemo(
    () => [
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
        url: CloudsOne,
        x: 0,
        y: 600,
        minScroll: 0,
        maxScroll: 1000,
      },
    ],
    []
  );

  const flameSprites: (FireJson & {
    currentFrameIndex: number;
    spriteSheet: HTMLImageElement;
  })[] = useMemo(
    () => [
      {
        ...FireOneSpriteJson,
        currentFrameIndex: 0,
        spriteSheet: FireOneSheet,
      },
      {
        ...FireTwoSpriteJson,
        currentFrameIndex: 0,
        spriteSheet: FireTwoSheet,
      },
      {
        ...FireThreeSpriteJson,
        currentFrameIndex: 0,
        spriteSheet: FireThreeSheet,
      },
      {
        ...FireFourSpriteJson,
        currentFrameIndex: 0,
        spriteSheet: FireFourSheet,
      },
      {
        ...BoomSpriteJson,
        currentFrameIndex: 0,
        spriteSheet: BoomSheet,
      },
    ],
    []
  );

  // const baseImageObjects = [
  //   { url: AirBalloonOne, initialX: 1000, initialY: 0 },
  //   { url: AirBalloonTwo, initialX: 1200, initialY: 0 },
  //   // Add the rest of your base images here...
  // ];

  // // const movingImageObjects = useMemo(
  // //   () => [
  // //     {
  // //       url: AirBalloonOne,
  // //       x: 700,
  // //       y: -400,
  // //       minScroll: 400,
  // //       maxScroll: 1000,
  // //     },
  // //     {
  // //       url: AirBalloonOne,
  // //       x: 1200,
  // //       y: -400,
  // //       minScroll: 500,
  // //       maxScroll: 1000,
  // //     },
  // //     {
  // //       url: AirBalloonTwo,
  // //       x: 1600,
  // //       y: -600,
  // //       minScroll: 600,
  // //       maxScroll: 1200,
  // //     },
  // //     {
  // //       url: AirBalloonOne,
  // //       x: 2200,
  // //       y: -900,
  // //       minScroll: 900,
  // //       maxScroll: 1400,
  // //     },
  // //     {
  // //       url: AirBalloonTwo,
  // //       x: 2500,
  // //       y: -1100,
  // //       minScroll: 1000,
  // //       maxScroll: 1600,
  // //     },
  // //     {
  // //       url: AirBalloonOne,
  // //       x: 2700,
  // //       y: -1600,
  // //       minScroll: 1700,
  // //       maxScroll: 2200,
  // //     },
  // //     {
  // //       url: AirBalloonOne,
  // //       x: 2450,
  // //       y: -1200,
  // //       minScroll: 1250,
  // //       maxScroll: 1600,
  // //     },

  // //     {
  // //       url: AirBalloonTwo,
  // //       x: 1950,
  // //       y: -1250,
  // //       minScroll: 1250,
  // //       maxScroll: 1600,
  // //     },
  // //     {
  // //       url: AirBalloonTwo,
  // //       x: 2000,
  // //       y: -1350,
  // //       minScroll: 1350,
  // //       maxScroll: 1750,
  // //     },
  // //     {
  // //       url: CloudsTwo,
  // //       x: 2000,
  // //       y: -1700,
  // //       minScroll: 2000,
  // //       maxScroll: 2500,
  // //     },
  // //     {
  // //       url: CloudsTwo,
  // //       x: 2200,
  // //       y: -2100,
  // //       minScroll: 3000,
  // //       maxScroll: 3500,
  // //     },
  // //     {
  // //       url: SatelliteOne,
  // //       x: 3500,
  // //       y: -3000,
  // //       minScroll: 3050,
  // //       maxScroll: 3500,
  // //     },
  // //     {
  // //       url: SatelliteOne,
  // //       x: 4500,
  // //       y: -3400,
  // //       minScroll: 3500,
  // //       maxScroll: 4000,
  // //     },
  // //     {
  // //       url: SatelliteTwo,
  // //       x: 4500,
  // //       y: -3600,
  // //       minScroll: 3700,
  // //       maxScroll: 3900,
  // //     },
  // //     {
  // //       url: PlanetImageOne,
  // //       x: 4500,
  // //       y: -4100,
  // //       minScroll: 3800,
  // //       maxScroll: 4500,
  // //     },
  // //     {
  // //       url: PlanetImageTwo,
  // //       x: 5500,
  // //       y: -4400,
  // //       minScroll: 3900,
  // //       maxScroll: 4650,
  // //     },
  // //     {
  // //       url: PlanetImageThree,
  // //       x: 5700,
  // //       y: -4000,
  // //       minScroll: 4100,
  // //       maxScroll: 4900,
  // //     },
  // //     {
  // //       url: GalaxyImageOne,
  // //       x: 6000,
  // //       y: -5000,
  // //       minScroll: 5000,
  // //       maxScroll: 5600,
  // //     },
  // //     {
  // //       url: StarsImage,
  // //       x: 6000,
  // //       y: -5500,
  // //       minScroll: 5500,
  // //       maxScroll: 10600,
  // //     },
  // //   ],
  // //   []
  // // );

  // const movingImageObjects = useMemo(() => {
  //   // Dynamically generate minScroll and other properties based on elapsed time
  //   const elapsedTime = now - currentStateStartTime;
  //   const scrollInterval = 1000; // This defines the gap between when images are introduced
  //   if (gameState !== RUNNING) return;

  //   return baseImageObjects.map((obj, index) => {
  //     const dynamicMinScroll = elapsedTime / 3 + index * scrollInterval;
  //     // Additional logic here to reset minScroll when the image moves off-screen
  //     // For simplicity, this example just keeps increasing minScroll based on elapsedTime

  //     return {
  //       ...obj,
  //       minScroll: dynamicMinScroll,
  //       maxScroll: dynamicMinScroll + 100,
  //     };
  //   });
  // }, [now]); // Depend on 'now' to recalculate when time updates

  // Calculate the starting position for new images

  // const generateMovingImageObjects = (elapsedTime: number) => {
  //   const baseImages = [
  //     { url: AirBalloonOne },
  //     { url: AirBalloonTwo },
  //     // Add additional images as needed
  //   ];
  //   const initialX = screenWidth;
  //   const initialY = -100; // Starting above the screen

  //   const speed = 0.1; // Speed of movement, adjust as necessary
  //   const imageProductionInterval = 1000; // New image every 1000ms (1 second)

  //   // Calculate the total distance moved by the first image
  //   const distanceMoved = elapsedTime * speed;

  //   return baseImages.map((obj, index) => {
  //     // Offset for each image based on its index to stagger their introduction
  //     const staggerOffset = index * 100; // Adjust based on desired spacing

  //     // Adjust position based on the total distance moved, applying modulo for continuous loop
  //     const effectiveDistance =
  //       (distanceMoved + staggerOffset) %
  //       (screenWidth + screenHeight + initialY);
  //     let newX = initialX - effectiveDistance;
  //     let newY = initialY + effectiveDistance;

  //     // Ensure newX and newY are within bounds to start from top right again
  //     if (newX < -100 || newY > screenHeight + 100) {
  //       newX = initialX - (effectiveDistance - (screenWidth + screenHeight));
  //       newY = initialY + (effectiveDistance - (screenWidth + screenHeight));
  //     }

  //     return {
  //       ...obj,
  //       x: newX,
  //       y: newY,
  //     };
  //   });
  // };

  const parachutes = useMemo(
    () => [
      {
        url: ParachuteSprite,
        x: 1800,
        y: 0,
        minScroll: 500,
        maxScroll: 600,
      },
      {
        url: ParachuteSprite,
        x: 1850,
        y: 0,
        minScroll: 500,
        maxScroll: 600,
      },
      {
        url: ParachuteSprite,
        x: 1850,
        y: -100,
        minScroll: 550,
        maxScroll: 650,
      },

      {
        url: ParachuteSprite,
        x: 1900,
        y: -150,
        minScroll: 550,
        maxScroll: 650,
      },

      {
        url: ParachuteSprite,
        x: 1950,
        y: -150,
        minScroll: 600,
        maxScroll: 700,
      },
      {
        url: ParachuteSprite,
        x: 2000,
        y: -150,
        minScroll: 600,
        maxScroll: 700,
      },
      {
        url: ParachuteSprite,
        x: 2050,
        y: -200,
        minScroll: 700,
        maxScroll: 800,
      },

      {
        url: ParachuteSprite,
        x: 2100,
        y: -250,
        minScroll: 800,
        maxScroll: 900,
      },

      {
        url: ParachuteSprite,
        x: 2150,
        y: -300,
        minScroll: 900,
        maxScroll: 1000,
      },

      {
        url: ParachuteSprite,
        x: 2200,
        y: -350,
        minScroll: 1000,
        maxScroll: 1100,
      },
      {
        url: ParachuteSprite,
        x: 2250,
        y: -400,
        minScroll: 1100,
        maxScroll: 1200,
      },
      {
        url: ParachuteSprite,
        x: 2300,
        y: -450,
        minScroll: 1200,
        maxScroll: 1300,
      },
      {
        url: ParachuteSprite,
        x: 2350,
        y: -500,
        minScroll: 1300,
        maxScroll: 1350,
      },
      {
        url: ParachuteSprite,
        x: 2400,
        y: -550,
        minScroll: 1400,
        maxScroll: 1450,
      },
      {
        url: ParachuteSprite,
        x: 2450,
        y: -600,
        minScroll: 800,
        maxScroll: 900,
      },
      {
        url: ParachuteSprite,
        x: 2500,
        y: -650,
        minScroll: 900,
        maxScroll: 1000,
      },
      {
        url: ParachuteSprite,
        x: 2550,
        y: -700,
        minScroll: 1000,
        maxScroll: 1100,
      },

      {
        url: ParachuteSprite,
        x: 2600,
        y: -750,
        minScroll: 1100,
        maxScroll: 1200,
      },
      {
        url: ParachuteSprite,
        x: 2600,
        y: -800,
        minScroll: 1100,
        maxScroll: 1200,
      },
      {
        url: ParachuteSprite,
        x: 2600,
        y: -800,
        minScroll: 1150,
        maxScroll: 1250,
      },
      {
        url: ParachuteSprite,
        x: 2550,
        y: -800,
        minScroll: 1150,
        maxScroll: 1250,
      },

      {
        url: ParachuteSprite,
        x: 2570,
        y: -820,
        minScroll: 1170,
        maxScroll: 1250,
      },
      {
        url: ParachuteSprite,
        x: 2590,
        y: -820,
        minScroll: 1170,
        maxScroll: 1270,
      },
      {
        url: ParachuteSprite,
        x: 2600,
        y: -840,
        minScroll: 1200,
        maxScroll: 1300,
      },
      {
        url: ParachuteSprite,
        x: 2800,
        y: -950,
        minScroll: 1300,
        maxScroll: 1400,
      },
      {
        url: ParachuteSprite,
        x: 2820,
        y: -950,
        minScroll: 1300,
        maxScroll: 1400,
      },
      {
        url: ParachuteSprite,
        x: 2850,
        y: -980,
        minScroll: 1300,
        maxScroll: 1400,
      },

      {
        url: ParachuteSprite,
        x: 2870,
        y: -1000,
        minScroll: 1300,
        maxScroll: 1400,
      },
      {
        url: ParachuteSprite,
        x: 2900,
        y: -1000,
        minScroll: 1350,
        maxScroll: 1450,
      },
      {
        url: ParachuteSprite,
        x: 2920,
        y: -1000,
        minScroll: 1350,
        maxScroll: 1450,
      },

      {
        url: ParachuteSprite,
        x: 2980,
        y: -1080,
        minScroll: 1400,
        maxScroll: 1500,
      },
      {
        url: ParachuteSprite,
        x: 2980,
        y: -1100,
        minScroll: 1450,
        maxScroll: 1550,
      },
      {
        url: ParachuteSprite,
        x: 3050,
        y: -1140,
        minScroll: 1450,
        maxScroll: 1550,
      },
      {
        url: ParachuteSprite,
        x: 3100,
        y: -1190,
        minScroll: 1500,
        maxScroll: 1650,
      },
      {
        url: ParachuteSprite,
        x: 3150,
        y: -1240,
        minScroll: 1550,
        maxScroll: 1700,
      },
      {
        url: ParachuteSprite,
        x: 3200,
        y: -1290,
        minScroll: 1600,
        maxScroll: 1750,
      },
      {
        url: ParachuteSprite,
        x: 3250,
        y: -1340,
        minScroll: 1650,
        maxScroll: 1800,
      },
      {
        url: ParachuteSprite,
        x: 3300,
        y: -1390,
        minScroll: 1700,
        maxScroll: 1850,
      },
      {
        url: ParachuteSprite,
        x: 3350,
        y: -1440,
        minScroll: 1750,
        maxScroll: 1900,
      },
      {
        url: ParachuteSprite,
        x: 3400,
        y: -1490,
        minScroll: 1800,
        maxScroll: 1950,
      },
      {
        url: ParachuteSprite,
        x: 3450,
        y: -1540,
        minScroll: 1850,
        maxScroll: 2000,
      },
      {
        url: ParachuteSprite,
        x: 3500,
        y: -1590,
        minScroll: 1900,
        maxScroll: 2050,
      },
      {
        url: ParachuteSprite,
        x: 3550,
        y: -1640,
        minScroll: 1950,
        maxScroll: 2100,
      },
      {
        url: ParachuteSprite,
        x: 3600,
        y: -1690,
        minScroll: 2000,
        maxScroll: 2150,
      },
      {
        url: ParachuteSprite,
        x: 3650,
        y: -1740,
        minScroll: 2050,
        maxScroll: 2200,
      },
      {
        url: ParachuteSprite,
        x: 3700,
        y: -1790,
        minScroll: 2100,
        maxScroll: 2250,
      },
      {
        url: ParachuteSprite,
        x: 3750,
        y: -1840,
        minScroll: 2150,
        maxScroll: 2300,
      },
      {
        url: ParachuteSprite,
        x: 3800,
        y: -1890,
        minScroll: 2200,
        maxScroll: 2350,
      },
      {
        url: ParachuteSprite,
        x: 3850,
        y: -1940,
        minScroll: 2250,
        maxScroll: 2400,
      },
      {
        url: ParachuteSprite,
        x: 3900,
        y: -1990,
        minScroll: 2300,
        maxScroll: 2450,
      },
      {
        url: ParachuteSprite,
        x: 3950,
        y: -2040,
        minScroll: 2350,
        maxScroll: 2500,
      },
      {
        url: ParachuteSprite,
        x: 4000,
        y: -2090,
        minScroll: 2400,
        maxScroll: 2550,
      },
      {
        url: ParachuteSprite,
        x: 4050,
        y: -2140,
        minScroll: 2450,
        maxScroll: 2600,
      },
      {
        url: ParachuteSprite,
        x: 4100,
        y: -2190,
        minScroll: 2500,
        maxScroll: 2650,
      },
    ],
    []
  );

  const stillObjects = [...stillImageObjects].sort(
    (a, b) => (a.zIndex || defaultZIndex) - (b.zIndex || defaultZIndex)
  );

  const resetJetPosition = () => {
    // Example initial positions, adjust these values as needed
    const initialJetX = 100;
    const initialJetY = 1000;

    const jetIndex = stillImageObjects.findIndex((obj) => obj.url === JetImage);
    if (jetIndex !== -1) {
      stillImageObjects[jetIndex].x = initialJetX;
      stillImageObjects[jetIndex].y = initialJetY;
    }
  };

  useEffect(() => {
    const bgCtx = bgCanvasRef.current?.getContext("2d");
    const loadingCtx = waitingCanvasRef.current?.getContext("2d");
    if (!bgCtx || !loadingCtx) return;
    for (const ctx of [bgCtx, loadingCtx]) {
      ctx.clearRect(0, 0, screenWidth, screenHeight);
    }

    const drawGradientBackground = () => {
      const gradient = bgCtx.createLinearGradient(
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

      bgCtx.fillStyle = gradient;

      bgCtx.save();

      bgCtx.translate(-offsetX, offsetY);
      bgCtx.fillRect(
        0,
        screenHeight,
        diagonalLength,
        screenHeight - diagonalLength
      );

      bgCtx.restore();
    };

    const drawStillImageObjects = () => {
      stillObjects.forEach((obj) => {
        const image = imageObjects.current.get(obj.url) as HTMLImageElement;

        if (image && image.src !== JetImage) {
          const scaledWidth = image.width * scale;
          const scaledHeight = image.height * scale;
          let scaledX: number, scaledY: number;
          if (
            scrollPosition >= obj.minScroll &&
            scrollPosition <= obj.maxScroll
          ) {
            scaledX = (obj.x - offsetX) * scale;
            scaledY = (obj.y + offsetY) * scale;

            bgCtx.drawImage(image, scaledX, scaledY, scaledWidth, scaledHeight);
          }
        }
      });
    };

    // const drawMovingImageObjects = () => {
    //   if (gameState !== RUNNING || !bgCtx || !movingImageObjects) return;
    //   movingImageObjects.forEach((obj) => {
    //     const image = imageObjects.current.get(obj.url) as HTMLImageElement;
    //     if (!image) return;

    //     // Calculate position based on dynamic minScroll, or any other logic
    //     const posX = obj.initialX - (obj.minScroll % screenWidth);
    //     const posY = obj.initialY + (obj.minScroll / screenWidth) * 100; // Example calculation

    //     bgCtx.drawImage(image, posX, posY, image.width, image.height);
    //   });
    // };

    // Drawing function remains mostly the same, but uses the `x` and `y` from `movingImageObjects`

    // const getRandomInitialPosition = () => {
    //   // Randomly choose between top edge or right edge for initial position
    //   if (Math.random() > 0.5) {
    //     // Position starts from the top edge, with a random X coordinate
    //     return { x: Math.random() * screenWidth, y: -100 };
    //   } else {
    //     // Position starts from the right edge, with a random Y coordinate
    //     return { x: screenWidth + 100, y: Math.random() * screenHeight };
    //   }
    // };

    // Function to generate moving image objects
    const generateMovingImageObjects = (elapsedTime: number) => {
      // Define the initial position for the entry of images
      const initialPosition = {
        x: (screenWidth - 300) * scale,
        y: -100, // Assuming the images are coming from just above the visible canvas
      };

      const baseImages = [
        { url: AirBalloonOne },
        { url: AirBalloonTwo },
        // Add more images as needed
      ];

      const speed = 0.1; // Adjust this to control the speed of the diagonal movement
      const imageProductionInterval = 1000; // New image every second

      // Create a pattern that allows images to enter the screen in a staggered manner
      return baseImages.flatMap((obj, index) => {
        // Calculate how many times an image has been reintroduced based on the elapsed time and production interval
        const repetitions = Math.floor(
          elapsedTime / (imageProductionInterval + index * 100)
        );

        // Generate positions for each repetition of the image
        return Array.from({ length: repetitions }).map((_, repIndex) => {
          const adjustedTime =
            elapsedTime - repIndex * imageProductionInterval - index * 100;
          const distanceMoved = adjustedTime * speed;

          // Calculate current positions based on the diagonal movement
          let newX = initialPosition.x - distanceMoved;
          let newY = initialPosition.y + distanceMoved;

          // Ensure the image reappears from the top right after moving off-screen
          if (newX < -100 || newY > screenHeight + 100) {
            newX = initialPosition.x;
            newY = initialPosition.y;
          }

          return {
            ...obj,
            x: newX,
            y: newY,
          };
        });
      });
    };

    const drawMovingImageObjects = () => {
      if (gameState !== RUNNING) return;
      const elapsedTime = now - currentStateStartTime; // Update this based on your game's logic
      const movingImageObjects = generateMovingImageObjects(elapsedTime);
      movingImageObjects.forEach((obj) => {
        const image = imageObjects.current.get(obj.url) as HTMLImageElement;
        if (!image) return;

        bgCtx.drawImage(image, obj.x, obj.y, image.width, image.height);
      });
    };

    const drawParachutes = () => {
      if (gameState !== RUNNING) return;
      parachutes.forEach((obj) => {
        const parachuteImage = imageObjects.current.get(
          obj.url
        ) as HTMLImageElement;

        if (parachuteImage) {
          const scaledWidth = parachuteImage.width * 0.2 * scale;
          const scaledHeight = parachuteImage.height * 0.2 * scale;
          let scaledX, scaledY;

          if (
            scrollPosition >= obj.minScroll &&
            scrollPosition <= obj.maxScroll
          ) {
            scaledX = (obj.x - offsetX) * scale;
            scaledY = (obj.y + offsetY) * scale;
            bgCtx.drawImage(
              parachuteImage,
              scaledX,
              scaledY,
              scaledWidth,
              scaledHeight
            );
          }
        }
      });
    };

    const drawLoading = () => {
      if (!loadingCtx || gameState !== WAITING || !loadingAssetsComplete)
        return;
      const image = new Image();
      image.src = LoaderSprite;

      const animationDuration = 6000;
      const totalFrames: number = LoaderSpriteJson.animations.Loader.length;
      const frameDuration = animationDuration / totalFrames;

      const frames = Object.values(LoaderSpriteJson.frames).map(
        (frameData) => ({
          ...frameData,
          frame: {
            x: frameData.frame.x,
            y: frameData.frame.y,
            width: frameData.frame.w,
            height: frameData.frame.h,
          },
        })
      );

      const elapsedTime = now - currentStateStartTime;
      const currentFrameIndex =
        Math.floor(elapsedTime / frameDuration) % frames.length;

      if (elapsedTime < animationDuration) {
        const frame = frames[currentFrameIndex]?.frame;
        const spriteImage = image;
        const scaledWidth = frame?.width * scale;
        const scaledHeight = frame?.height * scale;
        const scaledX = (screenWidth - scaledWidth) / 2;
        const scaledY = (screenHeight - scaledHeight) / 2;

        loadingCtx.drawImage(
          spriteImage,
          frame?.x,
          frame?.y,
          frame?.width,
          frame?.height,
          scaledX,
          scaledY,
          scaledWidth,
          scaledHeight
        );

        loadingCtx.fillStyle = "white";
        loadingCtx.font = `bold ${20 * scale}px Arial`;
        loadingCtx.textAlign = "center";
        loadingCtx.fillText(
          `Bet Receiving`,
          screenWidth / 2,
          screenHeight / 2 + scaledHeight
        );
      } else {
        if (gameState === WAITING) {
          setGameState(RUNNING);
          setCurrentStateStartTime(Date.now());
        }
      }
    };

    const drawJetAndFlameSprites = () => {
      if (gameState !== RUNNING || !imageObjects) return;
      const jetImage = imageObjects.current.get(JetImage) as HTMLImageElement;

      if (!jetImage) return;
      let scaledJetWidth = jetImage.width * scale;
      let scaledJetHeight = jetImage.height * scale;
      let newJetX = ((100 * 0) / 500) * scale;
      let newJetY = (1000 - Math.exp(0.0006 * 0) * 10) * scale;

      if (gameState === RUNNING && !explosionStarted) {
        const elapsedTime = Math.max(
          0,
          Math.min(now - currentStateStartTime, 7000)
        );
        const y = Math.exp(0.0006 * elapsedTime) * 10;

        const initialJetX = 100;
        const initialJetY = 1000;
        if (!jetImage) return;

        scaledJetWidth = jetImage.width * scale;
        scaledJetHeight = jetImage.height * scale;

        newJetX = ((initialJetX * elapsedTime) / 500) * scale;
        newJetY = (initialJetY - y) * scale;

        const totalElapsedTime = Math.max(0, now - currentStateStartTime);
        const totalRotationDuration = 2000;
        const elapsedRotationTime = Math.max(
          0,
          totalElapsedTime - totalRotationDuration
        );
        const rotationRate = (35 * Math.PI) / 180 / totalRotationDuration;
        const rotation = -Math.min(
          elapsedRotationTime * rotationRate,
          (35 * Math.PI) / 180
        );

        bgCtx.save();
        bgCtx.translate(
          newJetX + scaledJetWidth / 2,
          newJetY + scaledJetHeight / 2
        );

        bgCtx.rotate(rotation);

        bgCtx.drawImage(
          jetImage,
          -scaledJetWidth / 2,
          -scaledJetHeight / 2,
          scaledJetWidth,
          scaledJetHeight
        );

        const index = Math.min(
          Math.floor(totalElapsedTime / 5000),
          flameSprites.length - 1
        );
        const currentSprite = flameSprites[index];
        if (!currentSprite.spriteSheet.complete) {
          bgCtx.restore();
          return;
        }

        const frames = Object.values(currentSprite.frames);
        const frameDuration = 30;
        const currentFrameIndex =
          Math.floor(totalElapsedTime / frameDuration) % frames.length;
        const frame = frames[currentFrameIndex].frame;

        const flameOffsetX = -scaledJetWidth / 0.8;
        const flameOffsetY = -scaledJetHeight / 2;

        bgCtx.drawImage(
          currentSprite.spriteSheet,
          frame.x,
          frame.y,
          frame.w,
          frame.h,
          flameOffsetX,
          flameOffsetY,
          frame.w * scale,
          frame.h * scale
        );

        bgCtx.restore();
      }
    };

    const drawExplosion = () => {
      const jetImage = imageObjects.current.get(JetImage) as HTMLImageElement;

      if (!jetImage) return;
      // const scaledJetWidth = jetImage.width * scale;
      // const scaledJetHeight = jetImage.height * scale;

      if (gameState === ENDED && explosionStarted) {
        const explosionSprite = flameSprites[flameSprites.length - 1];
        if (!explosionSprite.spriteSheet.complete) return;
        const elapsedTimeSinceExplosion = Math.max(
          0,
          now - currentStateStartTime
        );

        const frames = Object.values(explosionSprite.frames);
        const frameDuration = 100;
        const currentFrameIndex =
          Math.floor(elapsedTimeSinceExplosion / frameDuration) % frames.length;

        const frame = frames[currentFrameIndex].frame;
        // const lastJetX = newJetX + scaledJetWidth / 2;
        // const lastJetY = newJetY + scaledJetHeight / 2;

        const lastJetX = screenWidth / 2;
        const lastJetY = screenHeight / 2;

        bgCtx.drawImage(
          explosionSprite.spriteSheet,
          frame.x,
          frame.y,
          frame.w,
          frame.h,
          // lastJetX - (explosionSprite.spriteSheet.width / 2) * scale,
          // lastJetY - (explosionSprite.spriteSheet.height / 2) * scale,
          lastJetX,
          lastJetY,
          frame.w * scale,
          frame.h * scale
        );

        if (elapsedTimeSinceExplosion >= 3000) {
          setExplosionStarted(false);
          setGameState(WAITING);
          setCurrentStateStartTime(Date.now());
        }
      }
    };

    drawLoading();
    drawGradientBackground();
    drawStillImageObjects();
    drawJetAndFlameSprites();
    drawMovingImageObjects();
    drawParachutes();
    drawExplosion();
  }, [gameState, now]);

  useEffect(() => {
    if (gameState === RUNNING) {
      const newMultiplier = generateMultiplier();
      targetMultiplier.current = newMultiplier;
    }
  }, [gameState]);

  useEffect(() => {
    if (
      targetMultiplier.current &&
      parseFloat(currentMultiplier) >= parseFloat(targetMultiplier.current)
    ) {
      resetJetPosition();
      setGameState(ENDED);
      setExplosionStarted(true);
      setCurrentStateStartTime(Date.now());
    }
  }, [gameState, currentMultiplier]);

  useEffect(() => {
    if (gameState === RUNNING) {
      const elapsed = now - currentStateStartTime;
      setElapsed(elapsed);

      if (elapsed > 2000) {
        const scrollRate = 2;

        setScrollPosition((prevPosition) =>
          Math.min(prevPosition + scrollRate, diagonalLength * 0.6)
        );
      }
    }

    // if (gameState === ENDED) {
    //   setScrollPosition(0);
    //   setExplosionStarted(true);
    //   setCurrentStateStartTime(Date.now());
    // }
  }, [now, gameState, diagonalLength]);

  useEffect(() => {
    let frameID: number;
    const animate = () => {
      setNow(Date.now());
      frameID = requestAnimationFrame(animate);
    };
    frameID = requestAnimationFrame(animate);
    return () => {
      if (frameID) cancelAnimationFrame(frameID);
    };
  }, []);

  return (
    <div>
      <div style={{ position: "relative" }}>
        {/* Background Canvas */}

        <canvas
          ref={bgCanvasRef}
          width={screenWidth}
          height={screenHeight}
          style={{
            maxWidth: "100%",
            zIndex: gameState === WAITING ? 1 : 2,
          }}
        />

        {/* Waiting Canvas */}

        <canvas
          ref={waitingCanvasRef}
          width={screenWidth}
          height={screenHeight}
          style={{
            maxWidth: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 3,
            display: gameState === WAITING ? "block" : "none",
          }}
        />

        {(gameState === RUNNING || gameState === ENDED) && (
          <div>
            <h1
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                fontSize: "calc(max(max(16px, 5vw), 22px))",
                transform: "translate(-50%, -50%)",
                whiteSpace: "nowrap",
                margin: 0,
                padding: 0,
                color:
                  parseFloat(currentMultiplier) >=
                  parseFloat(targetMultiplier.current || "0")
                    ? "red"
                    : "green",
              }}
            >
              {currentMultiplier} X
            </h1>

            <h2
              style={{
                position: "absolute",
                left: "50%",
                top: "calc(50% + 4rem)",
                fontSize: "calc(max(max(16px, 2vw), 16px))",
                transform: "translate(-50%, -50%)",
                whiteSpace: "nowrap",
                margin: 0,
                padding: 0,
              }}
            >
              {targetMultiplier.current !== null
                ? targetMultiplier.current
                : ""}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
