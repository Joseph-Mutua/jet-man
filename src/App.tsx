import React, { useEffect, useRef, useState } from "react";
import JetImageSrc from "./assets/images/jet.png";
import RoadImageSrc from "./assets/images/Road.png";
import BackgroundImageSrc from "./assets/images/canvas.jpg";
import "./App.css";

import Sprite from "./components/Sprite";
import { Frame } from "./components/types/sprite";

//Spriutes
interface JsonData {
  frames: Record<string, Frame>;
  animations: any;
  meta: any;
}

const sprites = [
  "Fire1",
  "Fire2",
  "Fire3",
  "Fire4",
  "Boom",
  "Loader",
  "Parachute0",
  "Parachute1",
  "Spaceman0",
  "Spaceman1",
];

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [targetGameOdds, setTargetGameOdds] = useState<string | null>(null);

  const [tilt, setTilt] = useState(false);
  const jetPosXRef = useRef(0);
  const jetPosYRef = useRef(0);
  const requestRef = useRef<number>(0);

  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | null>(null);

  // State for sprite image sources and JSON data
  const [spritesImageSrc, setSpritesImageSrc] = useState<string[]>([]);
  const [spritesJson, setSpritesJson] = useState<JsonData[]>([]);

  // Additional state to track the scrolling offset of background and road
  const [scrollOffset, setScrollOffset] = useState(0);

  const backgroundImage = new Image();
  backgroundImage.src = BackgroundImageSrc;
  const roadImage = new Image();
  roadImage.src = RoadImageSrc;
  const jetImage = new Image();
  jetImage.src = JetImageSrc;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      canvas &&
      backgroundImage.complete &&
      roadImage.complete &&
      jetImage.complete
    ) {
      canvas.width = window.innerWidth * 0.9;
      canvas.height = window.innerHeight * 0.8;
      draw();
    }
  }, [elapsedTime]);

  useEffect(() => {
    if (isRunning) {
      setTimeout(() => setTilt(true), 2000);
      requestRef.current = requestAnimationFrame(animate);
    } else {
      stopTimer();
      jetPosXRef.current = 0;
      jetPosYRef.current = 0;
      setTilt(false);
      draw();
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning, tilt]);

  // const draw = () => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas?.getContext("2d");
  //   if (!canvas || !ctx) return;

  //   // Clear the canvas
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   // Calculate the background and road positions based on the jet's movement
  //   let backgroundPosition = -jetPosXRef.current;
  //   let roadPosition = -jetPosXRef.current;

  //   // Draw the background with scrolling effect
  //   ctx.drawImage(
  //     backgroundImage,
  //     backgroundPosition,
  //     0,
  //     canvas.width,
  //     canvas.height
  //   );
  //   ctx.drawImage(
  //     backgroundImage,
  //     backgroundPosition + canvas.width,
  //     0,
  //     canvas.width,
  //     canvas.height
  //   );

  //   // Draw the road surface with scrolling effect
  //   ctx.drawImage(
  //     roadImage,
  //     roadPosition,
  //     canvas.height - roadImage.height,
  //     canvas.width,
  //     roadImage.height
  //   );
  //   ctx.drawImage(
  //     roadImage,
  //     roadPosition + canvas.width,
  //     canvas.height - roadImage.height,
  //     canvas.width,
  //     roadImage.height
  //   );

  //   // Draw the jet
  //   const radians = tilt ? Math.PI / 4 : 0;
  //   const jetX = jetPosXRef.current;
  //   const jetY =
  //     canvas.height - roadImage.height - jetImage.height - jetPosYRef.current;
  //   ctx.save();
  //   if (tilt) {
  //     ctx.translate(jetX + jetImage.width / 2, jetY + jetImage.height / 2);
  //     ctx.rotate(-radians);
  //     ctx.drawImage(jetImage, -jetImage.width / 2, -jetImage.height / 2);
  //   } else {
  //     ctx.drawImage(jetImage, jetX, jetY);
  //   }
  //   ctx.restore();
  // };

  // const animate = (timestamp: number) => {
  //   if (!startTimeRef.current) {
  //     startTimeRef.current = timestamp;
  //   } else {
  //     if (tilt) {
  //       const speed = 5;
  //       jetPosXRef.current += speed * Math.cos(Math.PI / 4);
  //       jetPosYRef.current += speed * Math.sin(Math.PI / 4);
  //     } else {
  //       jetPosXRef.current += 5;
  //     }
  //     draw();

  //     if (isRunning) {
  //       requestRef.current = requestAnimationFrame(animate);
  //     }
  //   }
  // };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      canvas &&
      backgroundImage.complete &&
      roadImage.complete &&
      jetImage.complete
    ) {
      canvas.width = window.innerWidth * 0.9;
      canvas.height = window.innerHeight * 0.8;
      draw();
    }
  }, [scrollOffset]); // Re-draw when scrollOffset changes

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Adjusted to use scrollOffset for background and road
    let backgroundPosition = scrollOffset % canvas.width;
    let roadPosition = scrollOffset % canvas.width;

    ctx.drawImage(
      backgroundImage,
      backgroundPosition,
      0,
      canvas.width,
      canvas.height
    );
    if (backgroundPosition > 0) {
      ctx.drawImage(
        backgroundImage,
        backgroundPosition - canvas.width,
        0,
        canvas.width,
        canvas.height
      );
    }

    ctx.drawImage(
      roadImage,
      roadPosition,
      canvas.height - roadImage.height,
      canvas.width,
      roadImage.height
    );
    if (roadPosition > 0) {
      ctx.drawImage(
        roadImage,
        roadPosition - canvas.width,
        canvas.height - roadImage.height,
        canvas.width,
        roadImage.height
      );
    }

    // The jet remains stationary at the center
    const jetX = canvas.width / 2 - jetImage.width / 2;
    const jetY = canvas.height - roadImage.height - jetImage.height;
    ctx.drawImage(jetImage, jetX, jetY);
  };

  const animate = () => {
    setScrollOffset((prev) => prev + 2); // Increment scroll offset to scroll background and road
    if (isRunning) {
      requestAnimationFrame(animate);
    }
  };

  const startTimer = () => {
    const startTime = performance.now();
    intervalRef.current = window.setInterval(() => {
      const newElapsedTime = performance.now() - startTime;
      setElapsedTime(newElapsedTime);
    }, 10);
  };

  const stopTimer = () => {
    if (intervalRef.current !== undefined) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
      setIsRunning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current !== undefined) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleStart = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setElapsedTime(0);
      const generatedOdds = generateTargetGameOdds();
      setTargetGameOdds(generatedOdds);
    }
  };

  useEffect(() => {
    if (isRunning) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [isRunning]);

  const currentGameOdds = Math.exp(0.00006 * elapsedTime).toFixed(2);

  useEffect(() => {
    if (
      targetGameOdds &&
      parseFloat(currentGameOdds) >= parseFloat(targetGameOdds)
    ) {
      setIsRunning(false);
      stopTimer();
    }
  }, [currentGameOdds, targetGameOdds]);

  const generateTargetGameOdds = () => {
    const maxElapsedTime = 30000;
    const randomElapsedTime = Math.random() * maxElapsedTime;
    return Math.exp(0.00006 * randomElapsedTime).toFixed(2);
  };

  // Load sprites when the component mounts or the isRunning state changes
  useEffect(() => {
    const loadSprites = async () => {
      const loadedImageSrc = [];
      const loadedJson = [];
      for (const spriteName of sprites) {
        const image = await import(`./assets/images/${spriteName}.png`);
        const json = await import(`./assets/data/${spriteName}.json`);
        loadedImageSrc.push(image.default);
        loadedJson.push(json.default);
      }
      setSpritesImageSrc(loadedImageSrc);
      setSpritesJson(loadedJson);
    };

    if (isRunning) {
      loadSprites();
    }
  }, [isRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      canvas &&
      backgroundImage.complete &&
      roadImage.complete &&
      jetImage.complete &&
      spritesImageSrc.length === sprites.length // Make sure sprites are loaded
    ) {
      canvas.width = window.innerWidth * 0.9;
      canvas.height = window.innerHeight * 0.8;
      draw();
    }
  }, [elapsedTime, spritesImageSrc.length]);

  return (
    <div className="App">
      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef} style={{ border: "1px solid red" }} />
        <h1
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            fontSize: "4rem",
            transform: "translate(-50%, -50%)",
            whiteSpace: "nowrap",
            margin: 0,
            padding: 0,
            color:
              parseFloat(currentGameOdds) >= parseFloat(targetGameOdds || "0")
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
            fontSize: "2rem",
            transform: "translate(-50%, -50%)",
            whiteSpace: "nowrap",
            margin: 0,
            padding: 0,
          }}
        >
          {targetGameOdds !== null ? targetGameOdds : ""}
        </h2>
      </div>
      <div>
        <button onClick={handleStart}>{isRunning ? "Stop" : "Start"}</button>
      </div>
    </div>
  );
};

export default App;
