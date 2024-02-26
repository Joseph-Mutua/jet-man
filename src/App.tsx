import React, { useEffect, useRef, useState } from "react";
import JetImageSrc from "./assets/images/jet.png";
import RoadImageSrc from "./assets/images/Road.png";
import BackgroundImageSrc from "./assets/images/canvas.jpg";
import "./App.css";

import Sprite from "./components/Sprite";
import { Frame } from "./components/types";

//Spriutes
interface JsonData {
  frames: Record<string, Frame>;
  animations: any;
  meta: any;
}

interface Position {
  x: number;
  y: number;
}

const fireSprites = ["Fire1", "Fire2", "Fire3", "Fire4"];

// const jetSprites = [
//   "Boom",
//   "Loader",
//   "Parachute0",
//   "Parachute1",
//   "Spaceman0",
//   "Spaceman1",
// ];

const App: React.FC = () => {
  const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const spriteCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [targetGameOdds, setTargetGameOdds] = useState<string | null>(null);

  const [tilt, setTilt] = useState(false);
  const jetPosXRef = useRef(0);
  //const jetPosYRef = useRef(0);
  const requestRef = useRef<number>(0);

  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | null>(null);

  const [imageSrc, setImageSrc] = useState("");
  const [json, setJson] = useState<JsonData | null>(null);
  const [currentSprite, setCurrentSprite] = useState(0);

  const [scrollOffset, setScrollOffset] = useState(0);
  const [jetSpeed, setJetSpeed] = useState(0);

  const [jetPosition, setJetPosition] = useState({ x: 0, y: 0 });
  const [shouldMove, setShouldMove] = useState(true);

  const currentGameOdds = Math.exp(0.00006 * elapsedTime).toFixed(2);

  const backgroundImage = new Image();
  backgroundImage.src = BackgroundImageSrc;
  const roadImage = new Image();
  roadImage.src = RoadImageSrc;
  const jetImage = new Image();
  jetImage.src = JetImageSrc;

  const draw = () => {
    const canvas = backgroundCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let backgroundPosition = scrollOffset % canvas.width;

    ctx.drawImage(
      backgroundImage,
      backgroundPosition,
      0,
      canvas.width,
      canvas.height
    );

    if (backgroundPosition < 0) {
      ctx.drawImage(
        backgroundImage,
        backgroundPosition + canvas.width,
        0,
        canvas.width,
        canvas.height
      );
    }

    let jetX = jetImage.width + jetSpeed;
    let jetY = canvas.height - roadImage.height - jetImage.height;

    ctx.save();
    if (tilt && shouldMove) {
      ctx.translate(
        jetPosition.x + jetImage.width / 2,
        jetPosition.y + jetImage.height / 2
      );
      ctx.rotate(-Math.PI / 4); // Adjust if a different tilt angle is desired
      ctx.translate(
        -jetPosition.x - jetImage.width / 2,
        -jetPosition.y - jetImage.height / 2
      );

      setJetSpeed((prev) => prev + 4);
      setJetPosition((prev) => {
        return {
          x: prev.x + 4 * Math.cos(Math.PI / 3),
          y: prev.y - 4 * Math.sin(Math.PI / 3),
        };
      });
      ctx.drawImage(jetImage, jetPosition.x, jetPosition.y);
      ctx.restore();
    } else if (tilt && !shouldMove) {
      ctx.translate(
        jetPosition.x + jetImage.width / 2,
        jetPosition.y + jetImage.height / 2
      );
      ctx.rotate(-Math.PI / 4); // Adjust if a different tilt angle is desired
      ctx.translate(
        -jetPosition.x - jetImage.width / 2,
        -jetPosition.y - jetImage.height / 2
      );
      ctx.drawImage(jetImage, jetPosition.x, jetPosition.y);
    } else {
      setJetSpeed((prev) => prev + 4);
      setJetPosition({ x: jetX, y: jetY });
      ctx.drawImage(jetImage, jetX, jetY);
    }
  };

  const animate = () => {
    if (
      !isRunning ||
      parseFloat(currentGameOdds) >= parseFloat(targetGameOdds || "0")
    ) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      return;
    }

    if (!tilt) {
      setScrollOffset((prev) => prev - 3);
    } else {
      setScrollOffset(0);
    }
    requestRef.current = requestAnimationFrame(animate);
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

  const handleStart = () => {
    if (isRunning) {
      setTilt(false);
      const canvas = spriteCanvasRef.current;
      const context = canvas?.getContext("2d");
      if (context && canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
      setCurrentSprite(0);
    }
    setIsRunning(!isRunning);

    if (!isRunning) {
      setElapsedTime(0);
      setTilt(false);
      const generatedOdds = generateTargetGameOdds();
      setTargetGameOdds(generatedOdds);
      setTimeout(() => {
        setTilt(true);
        setTimeout(() => {
          setShouldMove(false);
        }, 3000);
      }, 3000);
    }
  };

  useEffect(() => {
    const canvas = backgroundCanvasRef.current;
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
  }, [scrollOffset]);

  useEffect(() => {
    if (isRunning) {
      startTimer();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      const canvas = spriteCanvasRef.current;
      const context = canvas?.getContext("2d");
      if (context && canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
      setCurrentSprite(0);
      setScrollOffset(0);
      setJetSpeed(0);
      stopTimer();
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (
      targetGameOdds &&
      parseFloat(currentGameOdds) >= parseFloat(targetGameOdds)
    ) {
      setIsRunning(false);
      stopTimer();
    }
  }, [currentGameOdds, targetGameOdds]);

  useEffect(() => {
    const loadSprite = async (spriteName: string) => {
      const image = await import(`./assets/images/${spriteName}.png`);
      const json = await import(`./assets/data/${spriteName}.json`);
      setImageSrc(image.default);
      setJson(json.default);
    };

    loadSprite(fireSprites[currentSprite]);

    const interval = setInterval(() => {
      setCurrentSprite((prevSprite) => (prevSprite + 1) % fireSprites.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSprite]);

  useEffect(() => {
    if (spriteCanvasRef.current) {
      spriteCanvasRef.current.style.top = `${jetPosition.y}px`;
      spriteCanvasRef.current.style.left = `${jetPosition.x}px`;
      if (tilt) {
        spriteCanvasRef.current.style.top = `${
          jetPosition.y + jetImage.height * 2
        }px`;
        spriteCanvasRef.current.style.left = `${
          jetPosition.x + jetImage.width / 2.2
        }px`;
      }
    }
  }, [jetPosition, tilt]);

  useEffect(() => {
    const image = new Image();
    image.src = imageSrc;

    const canvas = spriteCanvasRef.current;
    const context = canvas?.getContext("2d");
    let currentFrame = 1;

    if (!json) return;

    const totalFrames = Object.keys(json.frames).length;
    let animationId: number;

    const animate = () => {
      if (context && canvas && json.frames && isRunning) {
        animationId = requestAnimationFrame(animate);
        context.clearRect(0, 0, canvas.width, canvas.height);

        const spriteName = json.meta.image.split(".")[0];
        const frameData = json.frames[`${spriteName}/${currentFrame}`]?.frame;

        if (frameData) {
          const halfWidth = frameData.w / 1.5;
          const halfHeight = frameData.h / 1.5;

          context.save();

          if (tilt) {
            const centerX = halfWidth / 1.5;
            const centerY = halfHeight / 1.5;

            context.translate(centerX, centerY);
            context.rotate((315 * Math.PI) / 180);
            context.translate(-centerX, -centerY);
          }

          context.drawImage(
            image,
            frameData.x,
            frameData.y,
            frameData.w,
            frameData.h,
            0,
            0,
            halfWidth,
            halfHeight
          );
          context.restore();

          currentFrame = (currentFrame % totalFrames) + 1;
        }
      }
    };

    if (isRunning) {
      animate();
    }

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [imageSrc, json, isRunning, tilt]);

  const generateTargetGameOdds = () => {
    const maxElapsedTime = 80000;
    const randomElapsedTime = Math.random() * maxElapsedTime;
    return Math.exp(0.00006 * randomElapsedTime).toFixed(2);
  };

  return (
    <div className="App">
      <div style={{ position: "relative" }}>
        <div>
          {" "}
          <canvas ref={backgroundCanvasRef} />
          <canvas
            ref={spriteCanvasRef}
            style={{
              position: "absolute",
            }}
          />
        </div>
        <h1
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            fontSize: "5rem",
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
