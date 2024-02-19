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

const fireSprites = ["Fire1", "Fire2", "Fire3", "Fire4"];

const jetSprites = [
  "Boom",
  "Loader",
  "Parachute0",
  "Parachute1",
  "Spaceman0",
  "Spaceman1",
];

const App: React.FC = () => {
  const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const spriteCanvasRef = useRef<HTMLCanvasElement | null>(null);
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
  const [imageSrc, setImageSrc] = useState("");
  const [json, setJson] = useState<JsonData | null>(null);
  const [currentSprite, setCurrentSprite] = useState(0);

  // Additional state to track the scrolling offset of background and road
  const [scrollOffset, setScrollOffset] = useState(0);

  const currentGameOdds = Math.exp(0.00006 * elapsedTime).toFixed(2);

  const backgroundImage = new Image();
  backgroundImage.src = BackgroundImageSrc;
  const roadImage = new Image();
  roadImage.src = RoadImageSrc;
  const jetImage = new Image();
  jetImage.src = JetImageSrc;

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
  }, [elapsedTime]);

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
  }, [scrollOffset]); // Re-draw when scrollOffset changes

  const draw = () => {
    const canvas = backgroundCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Use scrollOffset for background and road, adjusted for leftward scrolling
    let backgroundPosition = scrollOffset % canvas.width;
    let roadPosition = scrollOffset % canvas.width;

    // Draw the background with adjustments for leftward scrolling
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

    // Draw the road surface with adjustments for leftward scrolling
    ctx.drawImage(
      roadImage,
      roadPosition,
      canvas.height - roadImage.height,
      canvas.width,
      roadImage.height
    );
    if (roadPosition < 0) {
      ctx.drawImage(
        roadImage,
        roadPosition + canvas.width,
        canvas.height - roadImage.height,
        canvas.width,
        roadImage.height
      );
    }

    // Modify jet position to be in the bottom left corner
    const jetX = jetImage.width; // Start from the left side of the canvas
    const jetY = canvas.height - roadImage.height - jetImage.height; // Position above the road, at the bottom

    ctx.drawImage(jetImage, jetX, jetY);
  };

  const animate = () => {
    // Directly check if we should continue animating.
    if (
      !isRunning ||
      parseFloat(currentGameOdds) >= parseFloat(targetGameOdds || "0")
    ) {
      // When stopping, ensure no further animation frames are requested
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      return; // Stop the animation loop
    }

    setScrollOffset((prev) => prev - 5); // Decrement scroll offset to scroll background and road
    requestRef.current = requestAnimationFrame(animate);
  };

  // Handle the condition when currentGameOdds >= targetGameOdds
  useEffect(() => {
    if (parseFloat(currentGameOdds) >= parseFloat(targetGameOdds || "0")) {
      setIsRunning(false); // This will trigger the useEffect above to stop the animation
    }
  }, [currentGameOdds, targetGameOdds]);

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
      requestRef.current = requestAnimationFrame(animate);
    } else {
      // When stopping, reset the scrollOffset and ensure no further animation frames are requested
      setScrollOffset(0); // Reset scroll offset to stop scrolling
      stopTimer();
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }

    // Cleanup function to cancel any pending animation frame request when the component unmounts or rerenders
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

  const generateTargetGameOdds = () => {
    const maxElapsedTime = 30000;
    const randomElapsedTime = Math.random() * maxElapsedTime;
    return Math.exp(0.00006 * randomElapsedTime).toFixed(2);
  };

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
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSprite]);

  useEffect(() => {
    const canvas = backgroundCanvasRef.current;
    if (
      canvas &&
      backgroundImage.complete &&
      roadImage.complete &&
      jetImage.complete &&
      imageSrc.length === fireSprites.length // Make sure sprites are loaded
    ) {
      canvas.width = window.innerWidth * 0.9;
      canvas.height = window.innerHeight * 0.8;
      draw();
    }
  }, [elapsedTime, imageSrc.length]);

  useEffect(() => {
    const image = new Image();

    image.src = imageSrc;

    const canvas = spriteCanvasRef.current;
    const context = canvas?.getContext("2d");

    let currentFrame = 1;
    if (!json) return;
    const totalFrames = Object.keys(json.frames).length;

    const animate = () => {
      if (context && canvas && json.frames && isRunning) {
        requestAnimationFrame(animate);
        context.clearRect(0, 0, canvas.width, canvas.height);
        const spriteName = json.meta.image.split(".")[0];

        const frameData = json.frames[`${spriteName}/${currentFrame}`]?.frame;

        if (frameData) {
          // Calculate half the width and half the height
          const halfWidth = frameData.w / 1.5;
          const halfHeight = frameData.h / 1.5;

          // Draw the image at half its natural size
          context.drawImage(
            image,
            frameData.x,
            frameData.y,
            frameData.w, // Original width from the frame data
            frameData.h, // Original height from the frame data
            0, // dx - You can adjust this as needed
            0, // dy - You can adjust this as needed
            halfWidth, // dWidth - half of the original width
            halfHeight // dHeight - half of the original height
          );
          currentFrame = (currentFrame % totalFrames) + 1;
        }
      }
    };

    if (isRunning) {
      image.onload = animate;
    }
  }, [imageSrc, json, isRunning]);

  return (
    <div className="App">
      <div style={{ position: "relative" }}>
        <div>
          {" "}
          <canvas
            ref={backgroundCanvasRef}
            style={{
          
              border: "1px solid red",
            }}
          />
          <canvas
            ref={spriteCanvasRef}
            style={{
              position: "absolute",
              top:"79%",
              left:"10%",
            }}
          />
        </div>

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
      {/* <div>
        {imageSrc && json ? (
          <Sprite imageSrc={imageSrc} json={json} isRunning={isRunning} />
        ) : null}
      </div> */}
      <div>
        <button onClick={handleStart}>{isRunning ? "Stop" : "Start"}</button>
      </div>
    </div>
  );
};

export default App;
