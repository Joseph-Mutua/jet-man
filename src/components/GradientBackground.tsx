// import React, { useRef, useState, useEffect, useCallback } from "react";
// import "../App.css";

// //background images

// import AirportImage from "../assets/images/Airport.png";
// import RoadImage from "../assets/images/Road.png";
// import JetImage from "../assets/images/jet.png";
// import Fence from "../assets/images/Fence.png";
// import GarageImage from "../assets/images/Garage.png";

// import PlanetImageOne from "../assets/images/13.png";
// import PlanetImageTwo from "../assets/images/16.png";
// import PlanetImageThree from "../assets/images/21.png";

// import GalaxyImageOne from "../assets/images/18.png";
// import StarsImage from "../assets/images/Stars.png";

// //import AirportImageTwo from "../assets/images/"

// import CloudsOne from "../assets/images/Clouds1.png";
// import CloudsTwo from "../assets/images/Clouds2.png";
// import AirBalloonOne from "../assets/images/AirBalloon1.png";
// import AirBalloonTwo from "../assets/images/AirBalloon2.png";
// import SatelliteOne from "../assets/images/Satellite0.png";
// import SatelliteTwo from "../assets/images/Satellite1.png";

// //fire sprites
// import FireOneSprite from "../assets/images/Fire1.png";
// import FireOneSpriteJson from "../assets/data/Fire1.json";

// import FireTwoSprite from "../assets/images/Fire2.png";
// import FireTwoSpriteJson from "../assets/data/Fire2.json";

// import FireThreeSprite from "../assets/images/Fire3.png";
// import FireThreeSpriteJson from "../assets/data/Fire3.json";

// import FireFourSprite from "../assets/images/Fire4.png";
// import FireFourSpriteJson from "../assets/data/Fire4.json";

// import ParachuteSprite from "../assets/images/Parachute2.png";
// import { SpriteObject, SpriteFrames } from "./types";
// import { useWindowDimensions } from "./hooks/useWindowDimensions";
// import { generateTargetGameOdds } from "../utils/GenerateOdds";

// const BackgroundCanvas: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isScrolling, setIsScrolling] = useState(false);
//   const [scrollPosition, setScrollPosition] = useState(0);
//   const imageObjects = useRef(new Map());
//   const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
//   const [rotationAngle, setRotationAngle] = useState<number>(0);
//   const [rotateJet, setRotateJet] = useState(false);
//   const animationRef = useRef<number>();
//   const [jetPhase, setJetPhase] = useState("horizontal");
//   const [isRunning, setIsRunning] = useState(false);

//   const dimensions = useWindowDimensions();
//   const { screenWidth, screenHeight, scale } = dimensions;

//   const diagonalLength = Math.sqrt(screenWidth ** 2 + screenHeight ** 2) * 5;

//   const moveJetIntervalRef = useRef();
//   const tiltJetTimeoutRef = useRef();

//   const capturedXRef = useRef<number | null>(null);

//   const moveJetRef = useRef<number | null>(null);
//   const moveJetAngledRef = useRef<number | null>(null);
//   const angleTimeoutRef = useRef<number | null>(null);

//   const defaultZIndex = 1;

//   //Timer States
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const intervalRef = useRef<number | undefined>(undefined);
//   const startTimeRef = useRef<number | null>(null);
//   const [targetGameOdds, setTargetGameOdds] = useState<string | null>(null);
//   const currentGameOdds = Math.exp(0.00006 * elapsedTime).toFixed(2);

//   const [images, setImages] = useState<SpriteObject[]>([
//     {
//       url: RoadImage,
//       x: 0,
//       y: 960,
//       minScroll: 0,
//       maxScroll: 3000,
//       zIndex: 1,
//     },
//     {
//       url: JetImage,
//       x: 100,
//       y: 1000,
//       minScroll: 0,
//       maxScroll: 3000,
//       zIndex: 100,
//     },
//     {
//       url: AirportImage,
//       x: 10,
//       y: 660,
//       minScroll: 0,
//       maxScroll: 3000,
//       zIndex: 10,
//     },

//     {
//       url: CloudsOne,
//       x: 0,
//       y: 630,
//       minScroll: 0,
//       maxScroll: 3000,
//     },

//     {
//       url: Fence,
//       x: 0,
//       y: 880,
//       minScroll: 0,
//       maxScroll: 3000,
//     },

//     {
//       url: GarageImage,
//       x: 1100,
//       y: 880,
//       minScroll: 0,
//       maxScroll: 3000,
//     },

//     {
//       url: AirBalloonOne,
//       x: 700,
//       y: -400,
//       minScroll: 400,
//       maxScroll: 1000,
//     },

//     {
//       url: AirBalloonOne,
//       x: 700,
//       y: -400,
//       minScroll: 400,
//       maxScroll: 1000,
//     },
//     {
//       url: AirBalloonOne,
//       x: 1200,
//       y: -400,
//       minScroll: 500,
//       maxScroll: 1000,
//     },
//     {
//       url: AirBalloonTwo,
//       x: 1600,
//       y: -600,
//       minScroll: 600,
//       maxScroll: 1200,
//     },
//     {
//       url: AirBalloonOne,
//       x: 2200,
//       y: -900,
//       minScroll: 900,
//       maxScroll: 1400,
//     },
//     {
//       url: AirBalloonTwo,
//       x: 2500,
//       y: -1100,
//       minScroll: 1000,
//       maxScroll: 1600,
//     },
//     {
//       url: AirBalloonOne,
//       x: 2700,
//       y: -1600,
//       minScroll: 1700,
//       maxScroll: 2200,
//     },
//     {
//       url: AirBalloonOne,
//       x: 2450,
//       y: -1200,
//       minScroll: 1250,
//       maxScroll: 1600,
//     },

//     {
//       url: AirBalloonTwo,
//       x: 1950,
//       y: -1250,
//       minScroll: 1250,
//       maxScroll: 1600,
//     },
//     {
//       url: AirBalloonTwo,
//       x: 2000,
//       y: -1350,
//       minScroll: 1350,
//       maxScroll: 1750,
//     },

//     {
//       url: CloudsTwo,
//       x: 2200,
//       y: -2100,
//       minScroll: 3000,
//       maxScroll: 3500,
//     },
//     {
//       url: SatelliteOne,
//       x: 3500,
//       y: -3000,
//       minScroll: 3050,
//       maxScroll: 3500,
//     },
//     {
//       url: SatelliteOne,
//       x: 4500,
//       y: -3400,
//       minScroll: 3500,
//       maxScroll: 4000,
//     },
//     {
//       url: SatelliteTwo,
//       x: 4500,
//       y: -3600,
//       minScroll: 3700,
//       maxScroll: 3900,
//     },
//     {
//       url: PlanetImageOne,
//       x: 4500,
//       y: -4100,
//       minScroll: 3800,
//       maxScroll: 4500,
//     },
//     {
//       url: PlanetImageTwo,
//       x: 5500,
//       y: -4400,
//       minScroll: 3900,
//       maxScroll: 4650,
//     },
//     {
//       url: PlanetImageThree,
//       x: 5700,
//       y: -4000,
//       minScroll: 4100,
//       maxScroll: 4900,
//     },
//     {
//       url: GalaxyImageOne,
//       x: 6000,
//       y: -5000,
//       minScroll: 5000,
//       maxScroll: 5600,
//     },
//     {
//       url: StarsImage,
//       x: 6000,
//       y: -5500,
//       minScroll: 5500,
//       maxScroll: 10600,
//     },
//   ]);

//   const [sprites, setSprites] = useState([
//     {
//       url: FireOneSprite,
//       frames: FireOneSpriteJson.frames as SpriteFrames,
//       animation: FireOneSpriteJson.animations.Fire1,
//       x: 800,
//       y: 100,
//       minScroll: 20,
//       maxScroll: 500,
//       currentFrameIndex: 0,
//     },
//     {
//       url: FireTwoSprite,
//       frames: FireTwoSpriteJson.frames as SpriteFrames,
//       animation: FireTwoSpriteJson.animations.Fire2,
//       x: 800,
//       y: 100,
//       minScroll: 20,
//       maxScroll: 500,
//       currentFrameIndex: 0,
//     },
//     {
//       url: FireThreeSprite,
//       frames: FireThreeSpriteJson.frames as SpriteFrames,
//       animation: FireThreeSpriteJson.animations.Fire3,
//       x: 800,
//       y: 100,
//       minScroll: 20,
//       maxScroll: 500,
//       currentFrameIndex: 0,
//     },
//     {
//       url: FireFourSprite,
//       frames: FireFourSpriteJson.frames as SpriteFrames,
//       animation: FireFourSpriteJson.animations.Fire4,
//       x: 800,
//       y: 100,
//       minScroll: 20,
//       maxScroll: 500,
//       currentFrameIndex: 0,
//     },
//   ]);

//   const [parachutes, setParachutes] = useState([
//     {
//       url: ParachuteSprite,
//       x: 1800,
//       y: 0,
//       minScroll: 500,
//       maxScroll: 600,
//     },
//     {
//       url: ParachuteSprite,
//       x: 1850,
//       y: 0,
//       minScroll: 500,
//       maxScroll: 600,
//     },
//     {
//       url: ParachuteSprite,
//       x: 1850,
//       y: -100,
//       minScroll: 550,
//       maxScroll: 650,
//     },

//     {
//       url: ParachuteSprite,
//       x: 1900,
//       y: -150,
//       minScroll: 550,
//       maxScroll: 650,
//     },

//     {
//       url: ParachuteSprite,
//       x: 1950,
//       y: -150,
//       minScroll: 600,
//       maxScroll: 700,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2000,
//       y: -150,
//       minScroll: 600,
//       maxScroll: 700,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2050,
//       y: -200,
//       minScroll: 700,
//       maxScroll: 800,
//     },

//     {
//       url: ParachuteSprite,
//       x: 2100,
//       y: -250,
//       minScroll: 800,
//       maxScroll: 900,
//     },

//     {
//       url: ParachuteSprite,
//       x: 2150,
//       y: -300,
//       minScroll: 900,
//       maxScroll: 1000,
//     },

//     {
//       url: ParachuteSprite,
//       x: 2200,
//       y: -350,
//       minScroll: 1000,
//       maxScroll: 1100,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2250,
//       y: -400,
//       minScroll: 1100,
//       maxScroll: 1200,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2300,
//       y: -450,
//       minScroll: 1200,
//       maxScroll: 1300,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2350,
//       y: -500,
//       minScroll: 1300,
//       maxScroll: 1350,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2400,
//       y: -550,
//       minScroll: 1400,
//       maxScroll: 1450,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2450,
//       y: -600,
//       minScroll: 800,
//       maxScroll: 900,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2500,
//       y: -650,
//       minScroll: 900,
//       maxScroll: 1000,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2550,
//       y: -700,
//       minScroll: 1000,
//       maxScroll: 1100,
//     },

//     {
//       url: ParachuteSprite,
//       x: 2600,
//       y: -750,
//       minScroll: 1100,
//       maxScroll: 1200,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2600,
//       y: -800,
//       minScroll: 1100,
//       maxScroll: 1200,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2600,
//       y: -800,
//       minScroll: 1150,
//       maxScroll: 1250,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2550,
//       y: -800,
//       minScroll: 1150,
//       maxScroll: 1250,
//     },

//     {
//       url: ParachuteSprite,
//       x: 2570,
//       y: -820,
//       minScroll: 1170,
//       maxScroll: 1250,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2590,
//       y: -820,
//       minScroll: 1170,
//       maxScroll: 1270,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2600,
//       y: -840,
//       minScroll: 1200,
//       maxScroll: 1300,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2800,
//       y: -950,
//       minScroll: 1300,
//       maxScroll: 1400,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2820,
//       y: -950,
//       minScroll: 1300,
//       maxScroll: 1400,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2850,
//       y: -980,
//       minScroll: 1300,
//       maxScroll: 1400,
//     },

//     {
//       url: ParachuteSprite,
//       x: 2870,
//       y: -1000,
//       minScroll: 1300,
//       maxScroll: 1400,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2900,
//       y: -1000,
//       minScroll: 1350,
//       maxScroll: 1450,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2920,
//       y: -1000,
//       minScroll: 1350,
//       maxScroll: 1450,
//     },

//     {
//       url: ParachuteSprite,
//       x: 2980,
//       y: -1080,
//       minScroll: 1400,
//       maxScroll: 1500,
//     },
//     {
//       url: ParachuteSprite,
//       x: 2980,
//       y: -1100,
//       minScroll: 1450,
//       maxScroll: 1550,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3050,
//       y: -1140,
//       minScroll: 1450,
//       maxScroll: 1550,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3100,
//       y: -1190,
//       minScroll: 1500,
//       maxScroll: 1650,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3150,
//       y: -1240,
//       minScroll: 1550,
//       maxScroll: 1700,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3200,
//       y: -1290,
//       minScroll: 1600,
//       maxScroll: 1750,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3250,
//       y: -1340,
//       minScroll: 1650,
//       maxScroll: 1800,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3300,
//       y: -1390,
//       minScroll: 1700,
//       maxScroll: 1850,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3350,
//       y: -1440,
//       minScroll: 1750,
//       maxScroll: 1900,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3400,
//       y: -1490,
//       minScroll: 1800,
//       maxScroll: 1950,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3450,
//       y: -1540,
//       minScroll: 1850,
//       maxScroll: 2000,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3500,
//       y: -1590,
//       minScroll: 1900,
//       maxScroll: 2050,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3550,
//       y: -1640,
//       minScroll: 1950,
//       maxScroll: 2100,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3600,
//       y: -1690,
//       minScroll: 2000,
//       maxScroll: 2150,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3650,
//       y: -1740,
//       minScroll: 2050,
//       maxScroll: 2200,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3700,
//       y: -1790,
//       minScroll: 2100,
//       maxScroll: 2250,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3750,
//       y: -1840,
//       minScroll: 2150,
//       maxScroll: 2300,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3800,
//       y: -1890,
//       minScroll: 2200,
//       maxScroll: 2350,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3850,
//       y: -1940,
//       minScroll: 2250,
//       maxScroll: 2400,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3900,
//       y: -1990,
//       minScroll: 2300,
//       maxScroll: 2450,
//     },
//     {
//       url: ParachuteSprite,
//       x: 3950,
//       y: -2040,
//       minScroll: 2350,
//       maxScroll: 2500,
//     },
//     {
//       url: ParachuteSprite,
//       x: 4000,
//       y: -2090,
//       minScroll: 2400,
//       maxScroll: 2550,
//     },
//     {
//       url: ParachuteSprite,
//       x: 4050,
//       y: -2140,
//       minScroll: 2450,
//       maxScroll: 2600,
//     },
//     {
//       url: ParachuteSprite,
//       x: 4100,
//       y: -2190,
//       minScroll: 2500,
//       maxScroll: 2650,
//     },
//   ]);

//   // //Assume this function is triggered to add more sprites
//   // const generateSprites = (currentParachutes: ImageSprite[]) => {
//   //   const newSprites = [...currentParachutes];
//   //   let lastSprite = currentParachutes[currentParachutes.length - 1];

//   //   // Example increments identified from the pattern
//   //   const xIncrement = 50; // Adjust based on actual pattern
//   //   const yIncrement = -50; // Adjust based on actual pattern
//   //   const scrollIncrement = 50; // Adjust based on actual pattern

//   //   // Generate 10 new sprites for example
//   //   for (let i = 0; i < 20; i++) {
//   //     const newX = lastSprite.x + xIncrement;
//   //     const newY = lastSprite.y + yIncrement;
//   //     const newMinScroll = lastSprite.minScroll + scrollIncrement;
//   //     const newMaxScroll = lastSprite.maxScroll + scrollIncrement;

//   //     const newSprite = {
//   //       url: ParachuteSprite,
//   //       x: newX,
//   //       y: newY,
//   //       minScroll: newMinScroll,
//   //       maxScroll: newMaxScroll,https://www.youtube.com/watch?v=AJUqu8ilqO8
//   //     };

//   //     newSprites.push(newSprite);
//   //     lastSprite = newSprite;
//   //   }
//   //   console.log(newSprites);
//   // };

//   // useEffect(() => {
//   //   generateSprites(parachutes);
//   // }, []);

//   const startScrolling = () => {
//     setIsRunning(true);

//     startTimer();
//     const generatedOdds = generateTargetGameOdds();
//     setTargetGameOdds(generatedOdds);

//     let jetIndex = images.findIndex((img) => img.url === JetImage);

//     if (moveJetRef.current) clearInterval(moveJetRef.current);
//     if (moveJetAngledRef.current) clearInterval(moveJetAngledRef.current);
//     if (angleTimeoutRef.current) clearTimeout(angleTimeoutRef.current);

//     moveJetRef.current = setInterval(() => {
//       setImages((currentImages) =>
//         currentImages.map((img, index) => {
//           if (index === jetIndex) {
//             return { ...img, x: img.x + 5 };
//           }
//           return img;
//         })
//       );
//     }, 10) as unknown as number;

//     angleTimeoutRef.current = setTimeout(() => {
//       if (moveJetRef.current !== null) {
//         clearInterval(moveJetRef.current);
//       }
//       moveJetRef.current = null;

//       const jetIndex = images.findIndex((img) => img.url === JetImage);
//       const jet = images[jetIndex];

//       setJetPhase("angled");
//       setIsScrolling(true);
//       setTimeout(() => {
//         if (moveJetAngledRef.current !== null) {
//           clearInterval(moveJetAngledRef.current);
//           moveJetAngledRef.current = null;
//         }
//       }, 1500) as unknown as number;
//     }, 1500) as unknown as number;
//   };
//   const stopScrolling = useCallback(() => {
//     setIsRunning(false);
//     stopTimer();

//     setIsScrolling(false);
//     setJetPhase("horizontal");
//     setScrollPosition(0);

//     const jetIndex = images.findIndex((img) => img.url === JetImage);

//     setImages((currentImages) =>
//       currentImages.map((img, index) => {
//         if (index === jetIndex) {
//           return { ...img, x: 100, y: 1000 };
//         }
//         return img;
//       })
//     );
//     if (moveJetRef.current !== null) {
//       clearInterval(moveJetRef.current);
//       moveJetRef.current = null;
//     }
//     clearInterval(moveJetIntervalRef.current);
//     clearTimeout(tiltJetTimeoutRef.current);
//     moveJetIntervalRef.current = undefined;
//     tiltJetTimeoutRef.current = undefined;
//   }, [images]);

//   const animateSprite = useCallback(() => {
//     setSprites((currentSprites) =>
//       currentSprites.map((sprite) => {
//         if (isRunning) {
//           return {
//             ...sprite,
//             currentFrameIndex:
//               (sprite.currentFrameIndex + 1) % sprite.animation.length,
//           };
//         }
//         return sprite;
//       })
//     );
//     animationRef.current = requestAnimationFrame(animateSprite);
//   }, [isRunning]);

//   useEffect(() => {
//     let rotationInterval: string | number | NodeJS.Timer;

//     if (jetPhase === "angled" && !rotateJet) {
//       setRotateJet(true);
//       rotationInterval = setInterval(() => {
//         setRotationAngle((prevAngle) => {
//           const newAngle = prevAngle + 5;
//           if (newAngle >= 45) {
//             clearInterval(rotationInterval);
//             return 45;
//           }
//           return newAngle;
//         });
//       }, 20);
//     }

//     return () => clearInterval(rotationInterval);
//   }, [jetPhase, rotateJet]);

//   useEffect(() => {
//     animationRef.current = requestAnimationFrame(animateSprite);
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [animateSprite]);

//   useEffect(() => {
//     [...images, ...sprites, ...parachutes].forEach((img) => {
//       const image = new Image();
//       image.src = img.url;
//       image.onload = () => {
//         imageObjects.current.set(img.url, image);
//       };
//     });
//   }, [images, sprites, parachutes]);

//   useEffect(() => {
//     if (isScrolling) {
//       const scrollInterval = setInterval(() => {
//         setScrollPosition((prevPosition) => {
//           if (prevPosition >= diagonalLength * 0.6) {
//             clearInterval(scrollInterval);
//             return prevPosition;
//           }
//           return prevPosition + 1;
//         });
//       }, 5);
//       return () => clearInterval(scrollInterval);
//     }
//   }, [diagonalLength, isScrolling]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     canvas.width = screenWidth;
//     canvas.height = screenHeight;

//     ctx.clearRect(0, 0, screenWidth, screenHeight);

//     const gradient = ctx.createLinearGradient(
//       0,
//       screenHeight,
//       diagonalLength,
//       screenHeight - diagonalLength
//     );

//     gradient.addColorStop(0, "#A1757F");
//     gradient.addColorStop(0.2, "#4860A3");
//     gradient.addColorStop(0.4, "#293F6A");
//     gradient.addColorStop(0.6, "#162144");
//     gradient.addColorStop(0.8, "#151523");
//     gradient.addColorStop(1.0, "#151523");

//     ctx.fillStyle = gradient;
//     const offsetX = scrollPosition % diagonalLength;
//     const offsetY = scrollPosition % diagonalLength;

//     ctx.save();

//     ctx.translate(-offsetX, offsetY);
//     ctx.fillRect(
//       0,
//       screenHeight,
//       diagonalLength,
//       screenHeight - diagonalLength
//     );

//     ctx.restore();

//     const drawableObjects = [...images].sort(
//       (a, b) => (a.zIndex || defaultZIndex) - (b.zIndex || defaultZIndex)
//     );

//     drawableObjects.forEach((obj) => {
//       const image = imageObjects.current.get(obj.url);

//       if (image) {
//         let scaledWidth = image.width * scale;
//         let scaledHeight = image.height * scale;
//         let scaledX: number, scaledY: number;

//         if (image.src === JetImage) {
//           scaledX = (obj.x + offsetX) * scale;
//           scaledY = (obj.y - offsetY) * scale;

//           sprites.forEach((sprite) => {
//             if (elapsedTime < 5000) {
//               sprite.url = FireOneSprite;
//             } else if (elapsedTime < 12000) {
//               sprite.url = FireTwoSprite;
//             } else if (elapsedTime < 20000) {
//               sprite.url = FireThreeSprite;
//             } else {
//               sprite.url = FireFourSprite;
//             }

//             const frameKey = sprite.animation[sprite.currentFrameIndex];
//             const frame = sprite.frames[frameKey].frame;
//             const spriteImage = imageObjects.current.get(sprite.url);

//             if (spriteImage && isRunning) {
//               let spriteX: number = 0,
//                 spriteY: number = 0;
//               let angle = 0;

//               if (jetPhase === "horizontal") {
//                 spriteX = (obj.x + offsetX - image.width / 1.2) * scale;
//                 spriteY = (obj.y - offsetY) * scale;
//               } else if (
//                 jetPhase === "angled" &&
//                 scaledY > screenHeight * 0.25
//               ) {
//                 spriteX = (obj.x + offsetX - image.width / 2) * scale;
//                 spriteY = (obj.y - offsetY + image.height * 2) * scale;
//                 angle = (-45 * Math.PI) / 180;
//               } else if (
//                 jetPhase === "angled" &&
//                 scaledY <= screenHeight * 0.25
//               ) {
//                 spriteX = screenWidth * 0.73;
//                 spriteY = screenHeight * 0.35;
//                 angle = (-45 * Math.PI) / 180;
//               }

//               const scaledFrameWidth = frame.w * scale;
//               const scaledFrameHeight = frame.h * scale;

//               ctx.save();

//               if (jetPhase === "angled") {
//                 ctx.translate(
//                   spriteX + scaledFrameWidth / 2,
//                   spriteY + scaledFrameHeight / 2
//                 );
//                 ctx.rotate(angle);
//                 spriteX = spriteY = 0;
//               }

//               ctx.drawImage(
//                 spriteImage,
//                 frame.x,
//                 frame.y,
//                 frame.w,
//                 frame.h,
//                 spriteX - (jetPhase === "angled" ? scaledFrameWidth / 2 : 0),
//                 spriteY - (jetPhase === "angled" ? scaledFrameHeight / 2 : 0),
//                 scaledFrameWidth,
//                 scaledFrameHeight
//               );
//               ctx.restore();
//             }
//           });
//           if (scaledY <= screenHeight * 0.25) {
//             scaledY = screenHeight * 0.25;

//             if (capturedXRef.current === null) {
//               capturedXRef.current = scaledX;
//             }

//             scaledX = capturedXRef.current;
//           } else {
//             capturedXRef.current = null;
//           }

//           ctx.save();
//           ctx.translate(scaledX + scaledWidth / 2, scaledY + scaledHeight / 2);

//           if (jetPhase === "angled") {
//             ctx.rotate(-(45 * Math.PI) / 180);
//           }

//           ctx.drawImage(
//             image,
//             -scaledWidth / 2,
//             -scaledHeight / 2,
//             scaledWidth,
//             scaledHeight
//           );

//           ctx.restore();
//         } else if (
//           scrollPosition >= obj.minScroll &&
//           scrollPosition <= obj.maxScroll
//         ) {
//           scaledX = (obj.x - offsetX) * scale;
//           scaledY = (obj.y + offsetY) * scale;
//           ctx.drawImage(image, scaledX, scaledY, scaledWidth, scaledHeight);
//         }
//       }
//     });

//     parachutes.forEach((obj) => {
//       const parachuteImage = imageObjects.current.get(obj.url);

//       if (parachuteImage) {
//         let scaledWidth = parachuteImage.width * 0.2 * scale;
//         let scaledHeight = parachuteImage.height * 0.2 * scale;
//         let scaledX, scaledY;

//         if (
//           scrollPosition >= obj.minScroll &&
//           scrollPosition <= obj.maxScroll
//         ) {
//           scaledX = (obj.x - offsetX) * scale;
//           scaledY = (obj.y + offsetY) * scale;
//           ctx.drawImage(
//             parachuteImage,
//             scaledX,
//             scaledY,
//             scaledWidth,
//             scaledHeight
//           );
//         }
//       }
//     });
//   }, [
//     scrollPosition,
//     images,
//     parachutes,
//     sprites,
//     currentFrameIndex,
//     screenWidth,
//     screenHeight,
//     diagonalLength,
//     scale,
//     jetPhase,
//     isRunning,
//     elapsedTime,
//   ]);

//   const toggleScrolling = () => {
//     if (!isScrolling) {
//       startScrolling();
//     } else {
//       stopScrolling();
//     }
//   };

//   //Timer Functions
//   const startTimer = () => {
//     const startTime = performance.now();
//     intervalRef.current = window.setInterval(() => {
//       const newElapsedTime = performance.now() - startTime;
//       setElapsedTime(newElapsedTime);
//     }, 10);
//   };

//   const stopTimer = () => {
//     if (intervalRef.current !== undefined) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = undefined;
//       setIsRunning(false);
//     }
//   };

//   useEffect(() => {
//     if (
//       targetGameOdds &&
//       parseFloat(currentGameOdds) >= parseFloat(targetGameOdds)
//     ) {
//       if (isRunning) {
//         stopScrolling();
//       }
//     }
//   }, [currentGameOdds, isRunning, stopScrolling, targetGameOdds]);

//   return (
//     <div className="App">
//       <div style={{ position: "relative" }}>
//         <div></div>
//         <canvas
//           ref={canvasRef}
//           width={screenWidth}
//           height={screenHeight}
//           style={{ maxWidth: "100%" }}
//         />
//         <h1
//           style={{
//             position: "absolute",
//             left: "50%",
//             top: "50%",
//             fontSize: "50px",
//             transform: "translate(-50%, -50%)",
//             whiteSpace: "nowrap",
//             margin: 0,
//             padding: 0,
//             color:
//               parseFloat(currentGameOdds) >= parseFloat(targetGameOdds || "0")
//                 ? "red"
//                 : "green",
//           }}
//         >
//           {currentGameOdds} X
//         </h1>
//         <h2
//           style={{
//             position: "absolute",
//             left: "50%",
//             top: "calc(50% + 4rem)",
//             fontSize: "32px",
//             transform: "translate(-50%, -50%)",
//             whiteSpace: "nowrap",
//             margin: 0,
//             padding: 0,
//           }}
//         >
//           {targetGameOdds !== null ? targetGameOdds : ""}
//         </h2>
//       </div>

//       <div>
//         <button onClick={toggleScrolling}>
//           {isRunning ? "Stop" : "Start"}
//         </button>
//       </div>
//     </div>
//   );
// };
 export default {};
