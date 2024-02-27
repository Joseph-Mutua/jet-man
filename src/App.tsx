import React, { useEffect, useRef, useState } from "react";
import JetImageSrc from "./assets/images/jet.png";
import RoadImageSrc from "./assets/images/Road.png";
import BackgroundImageSrc from "./assets/images/canvas.jpg";
import { JsonData } from "./components/types";

import "./App.css";

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
  const requestRef = useRef<number>(0);
  const intervalRef = useRef<number | undefined>(undefined);

  const [state, setState] = useState({
    isRunning: false,
    targetGameOdds: null as string | null,
    tilt: false,
    elapsedTime: 0,
    scrollOffset: 0,
    jetSpeed: 0,
    jetPosition: { x: 0, y: 0 },
    shouldMove: false,
    currentSprite: 0,
    imageSrc: "",
    json: null as JsonData | null,
  });

  const {
    isRunning,
    targetGameOdds,
    tilt,
    elapsedTime,
    scrollOffset,
    jetSpeed,
    jetPosition,
    shouldMove,
    currentSprite,
    imageSrc,
    json,
  } = state;

  const currentGameOdds = Math.exp(0.00006 * state.elapsedTime).toFixed(2);

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
      ctx.rotate(-Math.PI / 4);
      ctx.translate(
        -jetPosition.x - jetImage.width / 2,
        -jetPosition.y - jetImage.height / 2
      );

      setState((prevState) => ({
        ...prevState,
        jetSpeed: prevState.jetSpeed + 4,
        jetPosition: {
          x: prevState.jetPosition.x + 4 * Math.cos(Math.PI / 3),
          y: prevState.jetPosition.y - 4 * Math.sin(Math.PI / 3),
        },
      }));

      ctx.drawImage(jetImage, jetPosition.x, jetPosition.y);
      ctx.restore();
    } else if (tilt && !shouldMove) {
      ctx.translate(
        jetPosition.x + jetImage.width / 2,
        jetPosition.y + jetImage.height / 2
      );
      ctx.rotate(-Math.PI / 4);
      ctx.translate(
        -jetPosition.x - jetImage.width / 2,
        -jetPosition.y - jetImage.height / 2
      );
      ctx.drawImage(jetImage, jetPosition.x, jetPosition.y);
    } else if (!tilt) {
      setState((prevState) => ({
        ...prevState,
        jetSpeed: prevState.jetSpeed + 4,
        jetPosition: { x: jetX, y: jetY },
      }));

      ctx.drawImage(jetImage, jetX, jetY);
    } else {
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
      setState((prevState) => ({
        ...prevState,
        scrollOffset: prevState.scrollOffset - 3,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        scrollOffset: 0,
      }));
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  const startTimer = () => {
    const startTime = performance.now();
    intervalRef.current = window.setInterval(() => {
      const newElapsedTime = performance.now() - startTime;
      setState((prevState) => ({
        ...prevState,
        elapsedTime: newElapsedTime,
      }));
    }, 10);
  };

  const stopTimer = () => {
    if (intervalRef.current !== undefined) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
      setState((prevState) => ({
        ...prevState,
        isRunning: false,
      }));
    }
  };

  const handleStart = () => {
    if (isRunning) {
      setState((prevState) => ({
        ...prevState,
        tilt: false,
        currentSprite: 0,
      }));

      const canvas = spriteCanvasRef.current;
      const context = canvas?.getContext("2d");
      if (context && canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setState((prevState) => ({
      ...prevState,
      isRunning: !prevState.isRunning,
    }));

    if (!isRunning) {
      setState((prevState) => ({
        ...prevState,
        elapsedTime: 0,
        tilt: false,
        targetGameOdds: generatedOdds,
      }));

      const generatedOdds = generateTargetGameOdds();

      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          tilt: true,
          shouldMove: true,
        }));

        setTimeout(() => {
          setState((prevState) => ({
            ...prevState,
            shouldMove: false,
          }));
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
      setState((prevState) => ({
        ...prevState,
        currentSprite: 0,
        scrollOffset: 0,
        jetSpeed: 0,
      }));

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
      setState((prevState) => ({
        ...prevState,
        isRunning: false,
        tilt: false,
        shouldMove: false,
      }));

      stopTimer();
    }
  }, [currentGameOdds, targetGameOdds]);

  useEffect(() => {
    const loadSprite = async (spriteName: string) => {
      const image = await import(`./assets/images/${spriteName}.png`);
      const json = await import(`./assets/data/${spriteName}.json`);
      setState((prevState) => ({
        ...prevState,
        imageSrc: image.default,
        json: json.default,
      }));
    };

    loadSprite(fireSprites[currentSprite]);

    const interval = setInterval(() => {
      setState((prevState) => ({
        ...prevState,
        currentSprite: (prevState.currentSprite + 1) % fireSprites.length,
      }));
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
