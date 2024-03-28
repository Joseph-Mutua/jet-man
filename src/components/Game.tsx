import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import "../App.css";

//Game
import { ENDED, IGameState, RUNNING, WAITING } from "../common/constants";

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

//import AirportImageTwo from "../assets/images/"

import CloudsOne from "../assets/images/Clouds1.png";
import CloudsTwo from "../assets/images/Clouds2.png";
import AirBalloonOne from "../assets/images/AirBalloon1.png";
import AirBalloonTwo from "../assets/images/AirBalloon2.png";
import SatelliteOne from "../assets/images/Satellite0.png";
import SatelliteTwo from "../assets/images/Satellite1.png";

//fire sprites
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
import BoomSpriteJson from "../assets/data/Boom.json";

//Loading sprites
import LoaderSprite from "../assets/images/Loader.png";
import LoaderSpriteJson from "../assets/data/Loader.json";

import ParachuteSprite from "../assets/images/Parachute2.png";
import {
  Frame,
  SpriteObject,
  JsonData,
  SpriteFrames,
  SpriteJson,
  ImageObject,
} from "./types";
import { useWindowDimensions } from "./hooks/useWindowDimensions";
import { generateTargetGameOdds } from "../utils/GenerateOdds";

const BackgroundCanvas: React.FC = () => {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const waitingCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjects = useRef(new Map());

  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [rotateJet, setRotateJet] = useState(false);

  //Game States
  const requestRef = useRef<number>();
  const animationRef = useRef<number>();

  const [jetPhase, setJetPhase] = useState("horizontal");
  const [loadingAssetsComplete, setLoadingAssetsComplete] = useState(false);

  const dimensions = useWindowDimensions();
  const { screenWidth, screenHeight, scale } = dimensions;
  const diagonalLength = Math.sqrt(screenWidth ** 2 + screenHeight ** 2) * 5;
  const offsetX = scrollPosition % diagonalLength;
  const offsetY = scrollPosition % diagonalLength;

  const moveJetIntervalRef = useRef();
  const tiltJetTimeoutRef = useRef();

  const capturedXRef = useRef<number | null>(null);

  const moveJetRef = useRef<number | null>(null);
  const moveJetAngledRef = useRef<number | null>(null);
  const angleTimeoutRef = useRef<number | null>(null);

  const defaultZIndex = 1;

  //Timer Statest
  const [gameState, setGameState] = useState<IGameState>(WAITING);
  //const [now, setSxtarttime] = useState(Date.now());

  const [now, setNow] = useState<number>(Date.now());
  const [currentStateStartTime, setCurrentStateStartTime] = useState<number>(
    Date.now()
  );

  const [elapsedTime, setElapsedTime] = useState(0);

  const [targetGameOdds, setTargetGameOdds] = useState<string | null>(null);

  const currentGameOdds = Math.exp(0.00006 * elapsedTime).toFixed(2);

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

  // const spriteDataUlrs = useMemo(
  //   () => [
  //     FireOneSpriteJson,
  //     FireTwoSpriteJson,
  //     FireThreeSpriteJson,
  //     FireFourSpriteJson,
  //   ],
  //   []
  // );

  // const animateSprite = useCallback(() => {
  //   setFlameSprites((currentSprites) =>
  //     currentSprites.map((sprite) => {
  //       if (gameState === RUNNING) {
  //         return {
  //           ...sprite,
  //           currentFrameIndex:
  //             (sprite.currentFrameIndex! + 1) % sprite.animation!.length,
  //         };
  //       }
  //       return sprite;
  //     })
  //   );
  //   animationRef.current = requestAnimationFrame(animateSprite);
  // }, [gameState]);

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

  const jetImage: ImageObject = {
    url: JetImage,
    x: 100,
    y: 1000,
    minScroll: 0,
    maxScroll: 3000,
    zIndex: 100,
  };

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
  ]);

  const [movingImageObjects, setMovingImageObjects] = useState([
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

    const drawJet = (elapsedTime: number) => {
      let jetIndex = stillObjects.findIndex((img) => img.url === JetImage);
      if (elapsedTime < 2000) {
        if (jetIndex !== -1) {
          let initialJetX = stillObjects[jetIndex].x;
          let movementDistance = (elapsedTime * 10) / 2000;

          stillObjects[jetIndex].x = initialJetX + movementDistance;

          const jetImage = imageObjects.current.get(JetImage);

          let scaledWidth = jetImage.width * scale;
          let scaledHeight = jetImage.height * scale;

          // let scaledX = jetImage.x * scale;
          // let scaledY = jetImage.y * scale;

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

      const image = imageObjects.current.get(JetImage);

      if (image) {
        let scaledWidth = image.width * scale;
        let scaledHeight = image.height * scale;

        let scaledX: number, scaledY: number;

        scaledX = (image.x + offsetX) * scale;
        scaledY = (image.y - offsetY) * scale;

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
        bgCtx.translate(scaledX + scaledWidth / 2, scaledY + scaledHeight / 2);

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

    // const updateJetPosition = (elapsedTime: number) => {
    //   let jetIndex = stillObjects.findIndex((img) => img.url === JetImage);
    //   if (jetIndex !== -1 && elapsedTime < 2000) {
    //     let initialJetX = stillObjects[jetIndex].x;
    //     let movementDistance = (elapsedTime * 10) / 2000;
    //     stillObjects[jetIndex].x = initialJetX + movementDistance;
    //   }
    // };

    // const updateSpritePositionAndRotation = (
    //   obj: HTMLImageElement,
    //   sprite: HTMLIFrameElement,
    //   elapsedTime: number,
    //   scaledX: number,
    //   scaledY: number,
    //   imageWidth: number,
    //   imageHeight: number
    // ) => {
    //   let spriteX,
    //     spriteY,
    //     angle = 0;
    //   if (elapsedTime < 2000) {
    //     spriteX = (obj.x + offsetX - imageWidth / 1.2) * scale;
    //     spriteY = (obj.y - offsetY) * scale;
    //   } else if (elapsedTime > 2000 && scaledY > screenHeight * 0.25) {
    //     spriteX = (obj.x + offsetX - imageWidth / 2) * scale;
    //     spriteY = (obj.y - offsetY + imageHeight * 2) * scale;
    //     angle = (-45 * Math.PI) / 180;
    //   } else if (elapsedTime > 2000 && scaledY <= screenHeight * 0.25) {
    //     spriteX = screenWidth * 0.73;
    //     spriteY = screenHeight * 0.35;
    //     angle = (-45 * Math.PI) / 180;
    //   }
    //   return { spriteX, spriteY, angle };
    // };

    // const drawSprite = (
    //   spriteImage: HTMLImageElement,
    //   frame: { x: number; y: number; w: number; h: number },
    //   elapsedTime: number,
    //   spriteX: number,
    //   spriteY: number,
    //   scaledFrameWidth: number,
    //   scaledFrameHeight: number,
    //   angle: number
    // ) => {
    //   bgCtx.save();
    //   if (elapsedTime > 2000) {
    //     bgCtx.translate(
    //       spriteX + scaledFrameWidth / 2,
    //       spriteY + scaledFrameHeight / 2
    //     );
    //     bgCtx.rotate(angle);
    //     spriteX = spriteY = 0;
    //   }
    //   bgCtx.drawImage(
    //     spriteImage,
    //     frame.x,
    //     frame.y,
    //     frame.w,
    //     frame.h,
    //     spriteX - (elapsedTime > 2000 ? scaledFrameWidth / 2 : 0),
    //     spriteY - (elapsedTime > 2000 ? scaledFrameHeight / 2 : 0),
    //     scaledFrameWidth,
    //     scaledFrameHeight
    //   );
    //   bgCtx.restore();
    // };

    // const drawJet = (
    //   image: HTMLImageElement,
    //   scaledX: number,
    //   scaledY: number,
    //   scaledWidth: number,
    //   scaledHeight: number,
    //   elapsedTime: number
    // ) => {
    //   bgCtx.save();
    //   bgCtx.translate(scaledX + scaledWidth / 2, scaledY + scaledHeight / 2);
    //   if (elapsedTime > 2000) {
    //     bgCtx.rotate(-(45 * Math.PI) / 180);
    //   }
    //   bgCtx.drawImage(
    //     image,
    //     -scaledWidth / 2,
    //     -scaledHeight / 2,
    //     scaledWidth,
    //     scaledHeight
    //   );
    //   bgCtx.restore();
    // };

    // const drawJetAndFlameSprites = () => {
    //   if (gameState !== RUNNING) return;
    //   const elapsedTime = Math.max(0, now - currentStateStartTime);

    //   updateJetPosition(elapsedTime);

    //   stillObjects.forEach((obj) => {
    //     const image = imageObjects.current.get(obj.url);
    //     if (!image || image.src !== JetImage) return;

    //     let scaledWidth = image.width * scale;
    //     let scaledHeight = image.height * scale;
    //     let scaledX = (obj.x + offsetX) * scale;
    //     let scaledY = (obj.y - offsetY) * scale;

    //     flameSprites.forEach((sprite) => {
    //       // Update sprite.url based on elapsedTime...
    //       const { spriteX, spriteY, angle } = updateSpritePositionAndRotation(
    //         obj,
    //         sprite,
    //         elapsedTime,
    //         scaledX,
    //         scaledY,
    //         image.width,
    //         image.height
    //       );
    //       const spriteImage = imageObjects.current.get(sprite.url);
    //       if (!spriteImage) return;

    //       // Determine the current frame and draw the sprite...
    //       let totalFrames = sprite.animation.length;
    //       const frameDuration = 10;
    //       const currentFrameIndex =
    //         Math.floor(elapsedTime / frameDuration) % totalFrames;
    //       const frameKey = sprite.animation[currentFrameIndex];
    //       const frame = sprite.frames[frameKey].frame;
    //       const scaledFrameWidth = frame.w * scale;
    //       const scaledFrameHeight = frame.h * scale;

    //       // Now drawing the sprite with position, frame, and rotation
    //       drawSprite(
    //         spriteImage,
    //         frame,
    //         elapsedTime,
    //         spriteX,
    //         spriteY,
    //         scaledFrameWidth,
    //         scaledFrameHeight,
    //         angle
    //       );

    //       // Update sprite.url to match the phase based on elapsedTime
    //       if (elapsedTime < 5000) {
    //         sprite.url = FireOneSprite;
    //       } else if (elapsedTime < 15000) {
    //         sprite.url = FireTwoSprite;
    //       } else if (elapsedTime < 35000) {
    //         sprite.url = FireThreeSprite;
    //       } else {
    //         sprite.url = FireFourSprite;
    //       }
    //     });

    //     // Draw the jet itself with potential rotation after 2 seconds
    //     drawJet(
    //       image,
    //       scaledX,
    //       scaledY,
    //       scaledWidth,
    //       scaledHeight,
    //       elapsedTime
    //     );

    //     if (scaledY <= screenHeight * 0.25) {
    //       scaledY = screenHeight * 0.25;

    //       if (capturedXRef.current === null) {
    //         capturedXRef.current = scaledX;
    //       }
    //       scaledX = capturedXRef.current;
    //     } else {
    //       capturedXRef.current = null;
    //     }
    //   });
    // };

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
  }, [
    currentStateStartTime,
    diagonalLength,
    elapsedTime,
    flameSprites,
    gameState,
    jetPhase,
    loadingAssetsComplete,
    movingImageObjects,
    offsetX,
    offsetY,
    scale,
    screenHeight,
    screenWidth,
    scrollPosition,
    now,
    stillObjects,
    currentFrameIndex,
  ]);

  useEffect(() => {
    let frameID: number;

    const animate = () => {
      setNow(Date.now());

      if (gameState === RUNNING) {
        const elapsed = now - currentStateStartTime;

        if (elapsed > 2000) {
          const scrollRate = 2;

          setScrollPosition((prevPosition) =>
            Math.min(prevPosition + scrollRate, diagonalLength * 0.6)
          );
        }
      }

      frameID = requestAnimationFrame(animate);
    };

    frameID = requestAnimationFrame(animate);

    return () => {
      if (frameID) cancelAnimationFrame(frameID);
    };
  }, [gameState, scrollPosition, diagonalLength, currentStateStartTime, now]);

  return (
    <div className="App">
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
                  parseFloat(targetGameOdds || "0")
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
              {targetGameOdds !== null ? targetGameOdds : ""}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundCanvas;
