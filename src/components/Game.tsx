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

import loaderWindowOne from "../assets/images/LoaderWindow0.png";
import loaderWindowOneJson from "../assets/data/LoaderWindow0.json";

import loaderWindowTwo from "../assets/images/LoaderWindow1.png";
import loaderWindowTwoJson from "../assets/data/LoaderWindow1.json";

//Parachute
import parachuteImage from "../assets/images/Parachute2.png";

import { useWindowDimensions } from "./hooks/useWindowDimensions";

import { MovingImageObject, ParachuteObject, SpriteJson } from "./types";
import { generateGameMultiplier } from "../utils/GenerateMultiplier";
import { loadImage } from "../utils/LoadImage";
import { extractSpriteFrames } from "../utils/ExtractSpriteFrames";

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
  loaderWindowOne,
  loaderWindowTwo,
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
    zIndex: 1,
  },
  {
    url: jetImage,
    x: 100,
    y: 1000,

    zIndex: 100,
  },
  {
    url: airportImage,
    x: 10,
    y: 660,
    zIndex: 10,
  },
  {
    url: fence,
    x: 0,
    y: 880,

    zIndex: 2,
  },
  {
    url: garageImage,
    x: 1100,
    y: 880,

    zIndex: 5,
  },
  {
    url: cloudsOne,
    x: 0,
    y: 600,
  },
];

const defaultZIndex = 1;
stillImageObjects.sort(
  (a, b) => (a.zIndex || defaultZIndex) - (b.zIndex || defaultZIndex)
);

const movingObjectStageOneUrls = [airBalloonOne, airBalloonTwo];

const movingObjectStageTwoUrls = [satelliteOne, satelliteTwo];

let movingImageObjects: MovingImageObject[] = [];

let parachuteObjects: ParachuteObject[] = [];

const movingObjectStageThreeUrls = [
  planetImageOne,
  planetImageTwo,
  planetImageThree,
  starsImage,
  cloudsTwo,
];

const flameSprites: (SpriteJson & {
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
  const loadingCanvasRef = useRef<HTMLCanvasElement>(null);
  const currentJetPosition = useRef({ x: 0, y: 0 });

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

  const targetMultiplier = useRef<number>(0);
  const [multiplierElapsed, setMultiplierElapsed] = useState(0);
  const currentMultiplier = parseFloat(
    Math.exp(0.00006 * multiplierElapsed).toFixed(2)
  );

  useEffect(() => {
    const bgCtx = bgCanvasRef.current?.getContext("2d");
    const loadingCtx = loadingCanvasRef.current?.getContext("2d");

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

          const scaledX = (obj.x - offsetX) * scale;
          const scaledY = (obj.y + offsetY) * scale;

          bgCtx.drawImage(image, scaledX, scaledY, scaledWidth, scaledHeight);
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
          dx: 1 + Math.random(),
          dy: 2 + Math.random() * 1.5,
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

          if (obj.x + scaledWidth < 0 || obj.y - scaledHeight > screenHeight) {
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

      const jet = imageObjects.get(jetImage) as HTMLImageElement;
      const initialJetX = 100;
      const initialJetY = 1000;

      if (!jet) return;

      const jetScale = Math.max(0.4, scale);
      const scaledJetHeight = jet.height * jetScale;

      const scaledJetWidth = jet.width * jetScale;

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

      currentJetPosition.current.x = newX;
      currentJetPosition.current.y = newY;

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

      const frameDuration = 40;
      const currentFrameIndex =
        Math.floor(totalElapsedTime / frameDuration) % frames.length;

      const frame = frames[currentFrameIndex].frame;

      const flameOffsetX = (-jet.width / 0.8) * jetScale;
      const flameOffsetY = (-jet.height / 2) * jetScale;

      bgCtx.drawImage(
        currentSprite.spriteSheet,
        frame.x,
        frame.y,
        frame.w,
        frame.h,
        flameOffsetX,
        flameOffsetY,
        frame.w * jetScale,
        frame.h * jetScale
      );

      bgCtx.restore();
    };

    const drawParachutes = () => {
      if (gameState !== RUNNING) return;
      const elapsedTime = Math.max(0, now - currentStateStartTime);
      if (elapsedTime < 1000) return;

      //parachuteObjects = [];
      if (parachuteObjects.length < 10 && Math.random() < 0.2) {
        const numParachutes = Math.floor(Math.random() * 5) + 1;

        for (let i = 0; i < numParachutes; i++) {
          const angle = (Math.random() * Math.PI) / 2;
          const direction = Math.sign(Math.random() - 0.5);
          const initialSpeed = 3 + Math.random() * 5;

          const newParachute = {
            url: parachuteImage,
            x: currentJetPosition.current.x,
            y: currentJetPosition.current.y,
            dx: direction * initialSpeed * Math.cos(angle),
            dy: -initialSpeed * Math.sin(angle),
            downwardSpeed: 2 + Math.random(),
            switchToDownward: false,
          };
          parachuteObjects.push(newParachute);
        }
      }

      parachuteObjects.forEach((obj, index) => {
        const parachuteToDraw = imageObjects.get(obj.url) as HTMLImageElement;
        const scaledWidth = parachuteToDraw.width * 0.2 * scale;
        const scaledHeight = parachuteToDraw.height * 0.2 * scale;

        if (
          !obj.switchToDownward &&
          obj.y < currentJetPosition.current.y - 150 * scale
        ) {
          obj.dy = obj.downwardSpeed;
          obj.switchToDownward = true;
        }

        obj.x -= obj.dx * scale;
        obj.y += obj.dy * scale;

        bgCtx.drawImage(
          parachuteToDraw,
          obj.x,
          obj.y,
          scaledWidth,
          scaledHeight
        );

        if (obj.x + scaledWidth < 0 || obj.y - scaledHeight > screenHeight) {
          parachuteObjects.splice(index, 1);
        }
      });
    };

    const drawLoading = () => {
      if (!loadingCtx || gameState !== WAITING || !loadingAssetsComplete)
        return;
      const elapsedTime = Math.max(0, now - currentStateStartTime);

      if (elapsedTime < 500) {
        const loaderWindowOneImage = imageObjects.get(
          loaderWindowOne
        ) as HTMLImageElement;
        const animationDuration = 500;
        const totalFrames: number =
          loaderWindowOneJson.animations.LoaderWindow.length;
        const frameDuration = animationDuration / totalFrames;

        const frames = extractSpriteFrames(loaderWindowOneJson);

        const currentFrameIndex =
          Math.floor(elapsedTime / frameDuration) % frames.length;

        const frame = frames[currentFrameIndex].frame;

        loadingCtx.drawImage(
          loaderWindowOneImage,
          frame.x,
          frame.y,
          frame.width,
          frame.height,
          0,
          0,
          screenWidth,
          screenHeight
        );
      } else if (elapsedTime < 5000) {
        loadingCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
        loadingCtx.fillRect(0, 0, screenWidth, screenHeight);

        const loaderImage = imageObjects.get(loaderSprite) as HTMLImageElement;
        const animationDuration = 5500;
        const totalFrames: number = loaderSpriteJson.animations.Loader.length;
        const frameDuration = animationDuration / totalFrames;

        const frames = extractSpriteFrames(loaderSpriteJson);

        const currentFrameIndex =
          Math.floor(elapsedTime / frameDuration) % frames.length;
        const frame = frames[currentFrameIndex].frame;
        const jetScale = Math.max(0.4, scale);

        const scaledWidth = frame.width * jetScale;
        const scaledHeight = frame.height * jetScale;
        const scaledX = (screenWidth - scaledWidth) / 2;
        const scaledY = (screenHeight - scaledHeight) / 2;

        loadingCtx.drawImage(
          loaderImage,
          frame.x,
          frame.y,
          frame.width,
          frame.height,
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
      } else if (elapsedTime < 5500) {
        const loaderWindowTwoImage = imageObjects.get(
          loaderWindowTwo
        ) as HTMLImageElement;

        const animationDuration = 500;
        const totalFrames: number =
          loaderWindowTwoJson.animations.LoaderWindow.length;
        const frameDuration = animationDuration / totalFrames;

        const frames = extractSpriteFrames(loaderWindowTwoJson);
        const currentFrameIndex =
          Math.floor(elapsedTime / frameDuration) % frames.length;
        const frame = frames[currentFrameIndex].frame;

        loadingCtx.drawImage(
          loaderWindowTwoImage,
          frame.x,
          frame.y,
          frame.width,
          frame.height,
          0,
          0,
          screenWidth,
          screenHeight
        );
      } else if (elapsedTime > 5400) {
        setGameState(RUNNING);
        setCurrentStateStartTime(Date.now());
      }
    };

    const drawExplosion = () => {
      if (gameState !== ENDED) return;
      const elapsedTime = Math.max(0, now - currentStateStartTime);

      if (elapsedTime > 1000) {
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
      const frameDuration = 50;
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
        currentJetPosition.current.x,
        currentJetPosition.current.y - scaledJetHeight,
        (frame.w * scale) / 1.5,
        (frame.h * scale) / 1.5
      );

      bgCtx.restore();
      parachuteObjects = [];
      movingImageObjects = [];
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
    if (gameState === WAITING) {
      targetMultiplier.current = generateGameMultiplier();
    }
  }, [gameState]);

  useEffect(() => {
    if (
      targetMultiplier.current &&
      currentMultiplier >= targetMultiplier.current
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
      setMultiplierElapsed(elapsed);

      if (elapsed > 2000) {
        const scrollRate = 4;

        setScrollPosition((prevPosition) =>
          Math.min(prevPosition + scrollRate, diagonalLength * 0.6)
        );
      }
    }

    if (gameState === WAITING) {
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
        ref={loadingCanvasRef}
        width={screenWidth}
        height={screenHeight}
        style={{
          maxWidth: "100%",
          position: "absolute",
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
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
              fontSize: "calc(max(max(16px, 7vw), 28px))",
              transform: "translate(-50%, -50%)",
              whiteSpace: "nowrap",
              margin: 0,
              padding: 0,
              color:
                currentMultiplier >= targetMultiplier.current ? "red" : "green",
            }}
          >
            {currentMultiplier} X
          </h1>

          {/* <h2
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
            {targetMultiplier.current !== null ? targetMultiplier.current : ""}
          </h2> */}
        </div>
      )}
    </div>
  );
};

export default Game;
