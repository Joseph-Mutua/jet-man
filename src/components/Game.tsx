import React, { useRef, useState, useEffect, useMemo } from "react";
import "../App.css";

//Game
import { IGameState, RUNNING, WAITING } from "../common/constants";

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

import FireTwoSprite from "../assets/images/Fire2.png";
import FireTwoSpriteJson from "../assets/data/Fire2.json";

import FireThreeSprite from "../assets/images/Fire3.png";
import FireThreeSpriteJson from "../assets/data/Fire3.json";

import FireFourSprite from "../assets/images/Fire4.png";
import FireFourSpriteJson from "../assets/data/Fire4.json";

//Explosion Sprite
import BoomSprite from "../assets/images/Boom.png";

//Loading sprites
import LoaderSprite from "../assets/images/Loader.png";
import LoaderSpriteJson from "../assets/data/Loader.json";

//Parachute
import ParachuteSprite from "../assets/images/Parachute2.png";

import { useWindowDimensions } from "./hooks/useWindowDimensions";
//import { generateTargetGameOdds } from "../utils/GenerateOdds";

import { SpriteObject, SpriteFrames } from "./types";
import { generateTargetGameOdds } from "../utils/GenerateOdds";

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

  const capturedXRef = useRef<number | null>(null); //Remove
  const defaultZIndex = 1;

  //Timer Statest
  const [gameState, setGameState] = useState<IGameState>(WAITING);
  const [elapsed, setElapsed] = useState(0);

  const [now, setNow] = useState<number>(Date.now());
  const [currentStateStartTime, setCurrentStateStartTime] = useState<number>(
    Date.now()
  );

  // const [targetGameOdds, setTargetGameOdds] = useState<string | null>(null);
  const targetGameOddsRef = useRef<string | null>(null);
  const currentGameOdds = Math.exp(0.00006 * elapsed).toFixed(2);

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

  const [stillImageObjects, setStillImageObjects] = useState([
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
  ]);

  const [flameSprites, setFlameSprites] = useState<SpriteObject[]>([
    {
      url: FireOneSprite,
      frames: FireOneSpriteJson.frames as SpriteFrames,
      animation: FireOneSpriteJson.animations.Fire1,
      x: 800,
      y: 100,
      minScroll: 20,
      maxScroll: 500,
      currentFrameIndex: 0,
    },
    {
      url: FireTwoSprite,
      frames: FireTwoSpriteJson.frames as SpriteFrames,
      animation: FireTwoSpriteJson.animations.Fire2,
      x: 800,
      y: 100,
      minScroll: 20,
      maxScroll: 500,
      currentFrameIndex: 0,
    },
    {
      url: FireThreeSprite,
      frames: FireThreeSpriteJson.frames as SpriteFrames,
      animation: FireThreeSpriteJson.animations.Fire3,
      x: 800,
      y: 100,
      minScroll: 20,
      maxScroll: 500,
      currentFrameIndex: 0,
    },
    {
      url: FireFourSprite,
      frames: FireFourSpriteJson.frames as SpriteFrames,
      animation: FireFourSpriteJson.animations.Fire4,
      x: 800,
      y: 100,
      minScroll: 20,
      maxScroll: 500,
      currentFrameIndex: 0,
    },
  ]);

  const [movingImageObjects, setMovingImageObjects] = useState([
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

  const [parachutes, setParachutes] = useState([
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
  ]);

  const stillObjects = [...stillImageObjects].sort(
    (a, b) => (a.zIndex || defaultZIndex) - (b.zIndex || defaultZIndex)
  );

  useEffect(() => {
    const bgCtx = bgCanvasRef.current?.getContext("2d");
    const waitingCtx = waitingCanvasRef.current?.getContext("2d");
    if (!bgCtx || !waitingCtx) return;
    for (const ctx of [bgCtx, waitingCtx]) {
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

    const selectSpriteBasedOnTime = (elapsedTime: number) => {
      if (elapsedTime < 5000) {
        return {
          sprite: FireOneSprite,
          data: FireOneSpriteJson,
        };
      } else if (elapsedTime < 15000) {
        return {
          sprite: FireTwoSprite,
          data: FireTwoSpriteJson,
        };
      } else if (elapsedTime < 35000) {
        return {
          sprite: FireThreeSprite,
          data: FireThreeSpriteJson,
        };
      } else {
        return {
          sprite: FireFourSprite,
          data: FireFourSpriteJson,
        };
      }
    };

    const drawJetAndFlameSprites = () => {
      if (gameState !== RUNNING) return;
      const elapsedTime = Math.max(0, now - currentStateStartTime);

      let jetIndex = stillObjects.findIndex((img) => img.url === JetImage);
      if (elapsedTime < 2000) {
        if (jetIndex !== -1) {
          let initialJetX = stillObjects[jetIndex].x;
          let movementDistance = (elapsedTime * 10) / 2000;

          stillObjects[jetIndex].x = initialJetX + movementDistance;

          const jetImage = imageObjects.current.get(JetImage);

          let scaledWidth = jetImage.width * scale;
          let scaledHeight = jetImage.height * scale;

          if (jetImage) {
            let scaledX = (jetImage.x + offsetX) * scale;
            let scaledY = (jetImage.y - offsetY) * scale;

            if (scaledY <= screenHeight * 0.25) {
              scaledY = screenHeight * 0.25;

              if (capturedXRef.current === null) {
                capturedXRef.current = scaledX;
              }
              scaledX = capturedXRef.current;
            } else {
              capturedXRef.current = null;
            }

            bgCtx.save();

            bgCtx.translate(
              scaledX + scaledWidth / 2,
              scaledY + scaledHeight / 2
            );

            if (elapsedTime > 2000) {
              bgCtx.rotate(-(45 * Math.PI) / 180);
            }

            bgCtx.restore();
          }
        }
      }

      stillObjects.forEach((obj) => {
        const image = imageObjects.current.get(obj.url);

        if (image) {
          let scaledWidth = image.width * scale;
          let scaledHeight = image.height * scale;

          let scaledX: number, scaledY: number;

          if (image.src === JetImage) {
            scaledX = (obj.x + offsetX) * scale;
            scaledY = (obj.y - offsetY) * scale;

            flameSprites.forEach((sprite) => {
              if (elapsedTime < 5000) {
                sprite.url = FireOneSprite;
              } else if (elapsedTime < 12000) {
                sprite.url = FireTwoSprite;
              } else if (elapsedTime < 20000) {
                sprite.url = FireThreeSprite;
              } else {
                sprite.url = FireFourSprite;
              }

              let totalFrames = sprite.animation.length;
              const frameDuration = 10;

              const currentFrameIndex =
                Math.floor(elapsedTime / frameDuration) % totalFrames;
              const frameKey = sprite.animation[currentFrameIndex];
              const frame = sprite.frames[frameKey].frame;

              const spriteImage = imageObjects.current.get(sprite.url);

              if (spriteImage) {
                let spriteX: number = 0,
                  spriteY: number = 0;
                let angle = 0;

                if (elapsedTime < 2000) {
                  spriteX = (obj.x + offsetX - image.width / 1.2) * scale;
                  spriteY = (obj.y - offsetY) * scale;
                } else if (
                  elapsedTime > 2000 &&
                  scaledY > screenHeight * 0.25
                ) {
                  spriteX = (obj.x + offsetX - image.width / 2) * scale;
                  spriteY = (obj.y - offsetY + image.height * 2) * scale;
                  angle = (-45 * Math.PI) / 180;
                } else if (
                  elapsedTime > 2000 &&
                  scaledY <= screenHeight * 0.25
                ) {
                  spriteX = screenWidth * 0.7;
                  spriteY = screenHeight * 0.35;
                  angle = (-45 * Math.PI) / 180;
                }

                const scaledFrameWidth = frame.w * scale;
                const scaledFrameHeight = frame.h * scale;

                bgCtx.save();

                if (elapsedTime > 2000) {
                  bgCtx.translate(
                    spriteX + scaledFrameWidth / 2,
                    spriteY + scaledFrameHeight / 2
                  );
                  bgCtx.rotate(angle);
                  spriteX = spriteY = 0;
                }

                bgCtx.drawImage(
                  spriteImage,
                  frame.x,
                  frame.y,
                  frame.w,
                  frame.h,
                  spriteX - (elapsedTime > 2000 ? scaledFrameWidth / 2 : 0),
                  spriteY - (elapsedTime > 2000 ? scaledFrameHeight / 2 : 0),
                  scaledFrameWidth,
                  scaledFrameHeight
                );

                bgCtx.restore();
              }
            });

            if (scaledY <= screenHeight * 0.25) {
              scaledY = screenHeight * 0.25;

              if (capturedXRef.current === null) {
                capturedXRef.current = scaledX;
              }
              scaledX = capturedXRef.current;
            } else {
              capturedXRef.current = null;
            }

            bgCtx.save();
            bgCtx.translate(
              scaledX + scaledWidth / 2,
              scaledY + scaledHeight / 2
            );

            if (elapsedTime > 2000) {
              bgCtx.rotate(-(45 * Math.PI) / 180);
            }

            bgCtx.drawImage(
              image,
              -scaledWidth / 2,
              -scaledHeight / 2,
              scaledWidth,
              scaledHeight
            );

            bgCtx.restore();
          }
        }
      });
    };

    const drawStillImageObjects = () => {
      stillObjects.forEach((obj) => {
        const image = imageObjects.current.get(obj.url);

        if (image && image.src !== JetImage) {
          let scaledWidth = image.width * scale;
          let scaledHeight = image.height * scale;
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

    const drawMovingImageObjects = () => {
      movingImageObjects.forEach((obj) => {
        const parachuteImage = imageObjects.current.get(obj.url);

        if (parachuteImage) {
          let scaledWidth = parachuteImage.width * scale;
          let scaledHeight = parachuteImage.height * scale;
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
    const drawParachutes = () => {
      parachutes.forEach((obj) => {
        const parachuteImage = imageObjects.current.get(obj.url);

        if (parachuteImage) {
          let scaledWidth = parachuteImage.width * 0.2 * scale;
          let scaledHeight = parachuteImage.height * 0.2 * scale;
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
      if (
        !waitingCtx ||
        gameState !== WAITING ||
        !loadingAssetsComplete ||
        !LoaderSpriteJson
      )
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
        const frame = frames[currentFrameIndex].frame;
        const spriteImage = image;
        const scaledWidth = frame.width * scale;
        const scaledHeight = frame.height * scale;
        const scaledX = (screenWidth - scaledWidth) / 2;
        const scaledY = (screenHeight - scaledHeight) / 2;

        waitingCtx.drawImage(
          spriteImage,
          frame.x,
          frame.y,
          frame.width,
          frame.height,
          scaledX,
          scaledY,
          scaledWidth,
          scaledHeight
        );

        waitingCtx.fillStyle = "white";
        waitingCtx.font = `bold ${20 * scale}px Arial`;
        waitingCtx.textAlign = "center";
        waitingCtx.fillText(
          `Bet Receiving`,
          screenWidth / 2,
          screenHeight / 2 + scaledHeight
        );
      } else {
        setGameState(RUNNING);
        setCurrentStateStartTime(Date.now());
      }
    };
    drawLoading();
    drawGradientBackground();
    drawStillImageObjects();
    drawJetAndFlameSprites();
    drawMovingImageObjects();
    drawParachutes();
  }, [gameState, now]);

  useEffect(() => {
    if (targetGameOddsRef.current === null) {
      targetGameOddsRef.current = generateTargetGameOdds();
    }
  }, []);

  useEffect(() => {
    if (
      targetGameOddsRef.current &&
      parseFloat(currentGameOdds) >= parseFloat(targetGameOddsRef.current)
    ) {
      if (gameState === RUNNING) {
        setGameState(WAITING);
      }
    }
  }, [gameState, currentGameOdds]);

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
  }, [now, gameState, currentStateStartTime, diagonalLength]);

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

        {gameState === RUNNING && (
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
                  parseFloat(currentGameOdds) >=
                  parseFloat(targetGameOddsRef.current || "0")
                    ? "red"
                    : "green",
              }}
            >
              {currentGameOdds} X
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
              {targetGameOddsRef.current !== null
                ? targetGameOddsRef.current
                : ""}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
