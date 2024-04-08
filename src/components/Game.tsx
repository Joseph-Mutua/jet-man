import React, { useEffect, useRef, useState } from "react";
import "../App.css";

//Game
import { ENDED, IGameState, RUNNING, WAITING } from "../common/constants";

//background images
import airportImage from "../assets/images/Airport.png";

import roadImage from "../assets/images/Road.png";
import jetImage from "../assets/images/jet.png";
import fence from "../assets/images/Fence.png";
import garageImage from "../assets/images/Garage.png";

import planetImageOne from "../assets/images/13.png";
import planetImageTwo from "../assets/images/16.png";
import planetImageThree from "../assets/images/21.png";

import galaxyImageOne from "../assets/images/18.png";
import starsImage from "../assets/images/Stars.png";

import cloudsOne from "../assets/images/Clouds1.png";
import cloudsTwo from "../assets/images/Clouds2.png";
import airBalloonOne from "../assets/images/AirBalloon1.png";
import airBalloonTwo from "../assets/images/AirBalloon2.png";
import satelliteOne from "../assets/images/Satellite0.png";
import satelliteTwo from "../assets/images/Satellite1.png";

//Flame Sprites
import fireOneSprite from "../assets/images/Fire1.png";
import fireOneSpriteJson from "../assets/data/Fire1.json";
import fireTwoSprite from "../assets/images/Fire2.png";
import fireTwoSpriteJson from "../assets/data/Fire2.json";
import fireThreeSprite from "../assets/images/Fire3.png";
import fireThreeSpriteJson from "../assets/data/Fire3.json";
import fireFourSprite from "../assets/images/Fire4.png";
import fireFourSpriteJson from "../assets/data/Fire4.json";

//Explosion Sprite
import boomSprite from "../assets/images/Boom.png";
import boomSpriteJson from "../assets/data/Boom.json";
const BoomSheet = new Image();
BoomSheet.src = boomSprite;

//Loading sprites
import loaderSprite from "../assets/images/Loader.png";
import loaderSpriteJson from "../assets/data/Loader.json";

//Parachute
import parachuteImage from "../assets/images/Parachute2.png";

import { useWindowDimensions } from "./hooks/useWindowDimensions";

import { FireJson } from "./types";
import { generateGameMultiplier } from "../utils/GenerateMultiplier";
import { loadImage } from "../utils/LoadImage";

const FireOneSheet = new Image();
FireOneSheet.src = fireOneSprite;

const FireTwoSheet = new Image();
FireTwoSheet.src = fireTwoSprite;

const FireThreeSheet = new Image();
FireThreeSheet.src = fireThreeSprite;

const FireFourSheet = new Image();
FireFourSheet.src = fireFourSprite;

const imageObjects = new Map();

const imageUrls = [
  airportImage,
  roadImage,
  jetImage,
  fence,
  garageImage,
  planetImageOne,
  planetImageTwo,
  planetImageThree,
  galaxyImageOne,
  starsImage,
  cloudsOne,
  cloudsTwo,
  airBalloonOne,
  airBalloonTwo,
  satelliteOne,
  satelliteTwo,
  parachuteImage,
];
const spriteUrls = [
  fireOneSprite,
  fireTwoSprite,
  fireThreeSprite,
  fireFourSprite,

  boomSprite,
  loaderSprite,
];
const allUrls = [...imageUrls, ...spriteUrls];
let loadingAssetsComplete = false;

Promise.all(
  allUrls.map((url) =>
    loadImage(url).then((image) => imageObjects.set(url, image))
  )
)
  .then(() => {
    loadingAssetsComplete = true;
  })
  .catch((error) => {
    throw error;
  });

const stillImageObjects = [
  {
    url: roadImage,
    x: 0,
    y: 960,
    minScroll: 0,
    maxScroll: 3000,
    zIndex: 1,
  },
  {
    url: jetImage,
    x: 100,
    y: 1000,
    minScroll: 0,
    maxScroll: 3000,
    zIndex: 100,
  },
  {
    url: airportImage,
    x: 10,
    y: 660,
    minScroll: 0,
    maxScroll: 3000,
    zIndex: 10,
  },
  {
    url: fence,
    x: 0,
    y: 880,
    minScroll: 0,
    maxScroll: 3000,
    zIndex: 2,
  },
  {
    url: garageImage,
    x: 1100,
    y: 880,
    minScroll: 0,
    maxScroll: 3000,
    zIndex: 5,
  },
  {
    url: cloudsOne,
    x: 0,
    y: 600,
    minScroll: 0,
    maxScroll: 1000,
  },
];

const defaultZIndex = 1;

stillImageObjects.sort(
  (a, b) => (a.zIndex || defaultZIndex) - (b.zIndex || defaultZIndex)
);

const movingObjectStageOneUrls = [airBalloonOne, airBalloonTwo];

const movingObjectStageTwoUrls = [satelliteOne, satelliteTwo];

const movingObjectStageThreeUrls = [
  planetImageOne,
  planetImageTwo,
  planetImageThree,
  starsImage,
  cloudsTwo,
];

const movingImageObjects = [
  {
    url: airBalloonOne,
    x: 0,
    y: 0,
    dx: 0.5 + Math.random(),
    dy: 1 + Math.random() * 1.5,
  },
];

const parachuteObjects = [
  {
    url: parachuteImage,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    disappearTime: 0,
  },
];

const flameSprites: (FireJson & {
  currentFrameIndex: number;
  spriteSheet: HTMLImageElement;
})[] = [
  {
    ...fireOneSpriteJson,
    currentFrameIndex: 0,
    spriteSheet: FireOneSheet,
  },
  {
    ...fireTwoSpriteJson,
    currentFrameIndex: 0,
    spriteSheet: FireTwoSheet,
  },
  {
    ...fireThreeSpriteJson,
    currentFrameIndex: 0,
    spriteSheet: FireThreeSheet,
  },
  {
    ...fireFourSpriteJson,
    currentFrameIndex: 0,
    spriteSheet: FireFourSheet,
  },
  {
    ...boomSpriteJson,
    currentFrameIndex: 0,
    spriteSheet: BoomSheet,
  },
];

const Game: React.FC = () => {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const waitingCanvasRef = useRef<HTMLCanvasElement>(null);
  const lastJetPosition = useRef({ x: 0, y: 0 });

  //Game States
  const { screenWidth, screenHeight, scale } = useWindowDimensions();

  const diagonalLength = Math.sqrt(screenWidth ** 2 + screenHeight ** 2) * 6;

  const [scrollPosition, setScrollPosition] = useState(0);
  const offsetX = scrollPosition % diagonalLength;
  const offsetY = scrollPosition % diagonalLength;

  //Timer States
  const [gameState, setGameState] = useState<IGameState>(WAITING);
  const [now, setNow] = useState<number>(Date.now());
  const [currentStateStartTime, setCurrentStateStartTime] = useState<number>(
    Date.now()
  );

  const targetMultiplier = useRef<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const currentMultiplier = Math.exp(0.00006 * elapsed).toFixed(2);

  useEffect(() => {
    const bgCtx = bgCanvasRef.current?.getContext("2d");
    const loadingCtx = waitingCanvasRef.current?.getContext("2d");

    if (!bgCtx || !loadingCtx || !loadingAssetsComplete) return;
    bgCtx.clearRect(0, 0, screenWidth, screenHeight);
    loadingCtx.clearRect(0, 0, screenWidth, screenHeight);

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
      stillImageObjects.forEach((obj) => {
        const image = imageObjects.get(obj.url) as HTMLImageElement;

        if (image && image.src !== jetImage) {
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

    const drawMovingImageObjects = () => {
      if (gameState !== RUNNING || !bgCtx) return;

      const elapsedTime = Math.max(0, now - currentStateStartTime);
      if (elapsedTime < 5000) return;

      let imagesToDraw: string[] = [];
      if (elapsedTime < 12000) {
        imagesToDraw = movingObjectStageOneUrls;
      } else if (elapsedTime < 45000) {
        imagesToDraw = [
          ...movingObjectStageOneUrls,
          ...movingObjectStageTwoUrls,
        ];
      } else if (elapsedTime > 45000) {
        imagesToDraw = [
          ...movingObjectStageTwoUrls,
          ...movingObjectStageThreeUrls,
        ];
      }

      if (movingImageObjects.length < 5) {
        const randomImageUrl =
          imagesToDraw[Math.floor(Math.random() * imagesToDraw.length)];
        const randomX = screenWidth / 1.5;
        const randomY = -Math.random() * 200;

        const newObject = {
          url: randomImageUrl,
          x: randomX,
          y: randomY,
          dx: 0.5 + Math.random(),
          dy: 1 + Math.random() * 1.5,
        };

        movingImageObjects.push(newObject);
      }

      movingImageObjects.forEach((obj, index) => {
        const imageToDraw = imageObjects.get(obj.url) as HTMLImageElement;

        if (imageToDraw) {
          const scaledWidth = imageToDraw.width * scale;
          const scaledHeight = imageToDraw.height * scale;

          obj.x -= obj.dx * scale;
          obj.y += obj.dy * scale;

          bgCtx.drawImage(imageToDraw, obj.x, obj.y, scaledWidth, scaledHeight);

          if (obj.x + scaledWidth < 0 || obj.y + scaledHeight > screenHeight) {
            movingImageObjects.splice(index, 1);
          }
        }
      });
    };

    const drawJetAndFlameSprites = () => {
      if (gameState !== RUNNING) return;

      const elapsedTime = Math.max(
        0,
        Math.min(now - currentStateStartTime, 7000)
      );
      const y = Math.exp(0.0006 * elapsedTime) * 10;

      const initialJetX = 100;
      const initialJetY = 1000;
      const jet = imageObjects.get(jetImage) as HTMLImageElement;

      if (!jet) return;

      const scaledJetWidth = jet.width * scale;
      const scaledJetHeight = jet.height * scale;

      const newX = ((initialJetX * elapsedTime) / 500) * scale;
      const newY = (initialJetY - y) * scale;

      const totalElapsedTime = Math.max(0, now - currentStateStartTime);
      const rotationDuration = 2000;
      const elapsedRotationTime = Math.max(
        0,
        totalElapsedTime - rotationDuration
      );

      const rotationRate = (35 * Math.PI) / 180 / rotationDuration;
      const rotation = -Math.min(
        elapsedRotationTime * rotationRate,
        (35 * Math.PI) / 180
      );

      bgCtx.save();
      bgCtx.translate(newX + scaledJetWidth / 2, newY + scaledJetHeight / 2);
      bgCtx.rotate(rotation);

      bgCtx.drawImage(
        jet,
        -scaledJetWidth / 2,
        -scaledJetHeight / 2,
        scaledJetWidth,
        scaledJetHeight
      );

      lastJetPosition.current.x = newX;
      lastJetPosition.current.y = newY;

      const index = Math.min(
        Math.floor(totalElapsedTime / 5000),
        flameSprites.length - 2
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

      const flameOffsetX = (-jet.width / 0.8) * scale;
      const flameOffsetY = (-jet.height / 2) * scale;

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
    };
    const drawParachutes = () => {
      if (gameState !== RUNNING || !bgCtx || !parachuteImage) return;

      if (parachuteObjects.length < 20 && Math.random() < 0.2) {
        const numParachutes = Math.floor(Math.random() * 10) + 1;

        for (let i = 0; i < numParachutes; i++) {
          const angle = Math.random() * Math.PI;
          const direction = Math.sign(Math.random() - 0.5);

          const speedX = 1 + Math.random() * 2;
          const speedY = 3 + Math.random() * 2;

          const newParachute = {
            url: parachuteImage,
            x: lastJetPosition.current.x,
            y: lastJetPosition.current.y,
            dx: direction * speedX * Math.cos(angle),
            dy: speedY * Math.sin(angle),
            disappearTime: now + (3000 + Math.random() * 5000),
          };

          parachuteObjects.push(newParachute);
        }
      }

      parachuteObjects.forEach((obj, index) => {
        const imageToDraw = imageObjects.get(obj.url) as HTMLImageElement;
        const scaledWidth = imageToDraw.width * 0.2 * scale;
        const scaledHeight = imageToDraw.height * 0.2 * scale;

        obj.x -= obj.dx * scale;
        obj.y += obj.dy * scale;

        bgCtx.drawImage(imageToDraw, obj.x, obj.y, scaledWidth, scaledHeight);

        if (
          obj.x + scaledWidth < 0 ||
          obj.y + scaledHeight > screenHeight ||
          now > obj.disappearTime
        ) {
          parachuteObjects.splice(index, 1);
        }
      });
    };

    const drawLoading = () => {
      if (!loadingCtx || gameState !== WAITING || !loadingAssetsComplete)
        return;
      const elapsedTime = Math.max(0, now - currentStateStartTime);

      if (elapsedTime > 6000) {
        setGameState(RUNNING);
        setCurrentStateStartTime(Date.now());
        return;
      }

      const loaderImage = imageObjects.get(loaderSprite) as HTMLImageElement;

      const animationDuration = 6000;
      const totalFrames: number = loaderSpriteJson.animations.Loader.length;
      const frameDuration = animationDuration / totalFrames;

      const frames = Object.values(loaderSpriteJson.frames).map(
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

      const currentFrameIndex =
        Math.floor(elapsedTime / frameDuration) % frames.length;
      const frame = frames[currentFrameIndex]?.frame;

      const scaledWidth = frame?.width * scale;
      const scaledHeight = frame?.height * scale;
      const scaledX = (screenWidth - scaledWidth) / 2;
      const scaledY = (screenHeight - scaledHeight) / 2;

      loadingCtx.drawImage(
        loaderImage,
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
    };

    const drawExplosion = () => {
      if (gameState !== ENDED) return;
      const elapsedTime = Math.max(0, now - currentStateStartTime);

      if (elapsedTime > 2000) {
        setGameState(WAITING);
        setCurrentStateStartTime(Date.now());
        return;
      }

      const index = flameSprites.length - 1;

      const currentSprite = flameSprites[index];
      if (!currentSprite.spriteSheet.complete) {
        bgCtx.restore();
        return;
      }
      const frames = Object.values(currentSprite.frames);
      const frameDuration = 100;
      const currentFrameIndex =
        Math.floor(elapsedTime / frameDuration) % frames.length;
      const frame = frames[currentFrameIndex].frame;

      const jet = imageObjects.get(jetImage) as HTMLImageElement;
      const scaledJetHeight = jet.height * scale * 2;

      bgCtx.drawImage(
        currentSprite.spriteSheet,
        frame.x,
        frame.y,
        frame.w,
        frame.h,
        lastJetPosition.current.x,
        lastJetPosition.current.y - scaledJetHeight,
        (frame.w * scale) / 1.5,
        (frame.h * scale) / 1.5
      );
      bgCtx.restore();
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
      targetMultiplier.current = generateGameMultiplier();
    }
  }, [gameState]);

  useEffect(() => {
    if (
      targetMultiplier.current &&
      parseFloat(currentMultiplier) >= parseFloat(targetMultiplier.current)
    ) {
      if (gameState === RUNNING) {
        setGameState(ENDED);
        setCurrentStateStartTime(Date.now());
      }
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

    if (gameState === WAITING || gameState === ENDED) {
      setScrollPosition(0);
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
