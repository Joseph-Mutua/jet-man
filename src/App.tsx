import React, { useEffect, useRef, useState } from "react";
import JetImageSrc from "./assets/images/jet.png";
import RoadImageSrc from "./assets/images/Road.png";
import BackgroundImageSrc from "./assets/images/canvas.jpg";
import "./App.css";

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const [tilt, setTilt] = useState(false);
  const jetPosXRef = useRef(0);
  const jetPosYRef = useRef(0);
  const requestRef = useRef<number>(0);

  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | null>(null);

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

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      roadImage,
      0,
      canvas.height - roadImage.height,
      canvas.width,
      roadImage.height
    );

    const radians = tilt ? Math.PI / 4 : 0;
    const jetX = jetPosXRef.current;
    const jetY =
      canvas.height - roadImage.height - jetImage.height - jetPosYRef.current;

    ctx.save();
    if (tilt) {
      ctx.translate(jetX + jetImage.width / 2, jetY + jetImage.height / 2);
      ctx.rotate(-radians);
      ctx.drawImage(jetImage, -jetImage.width / 2, -jetImage.height / 2);
    } else {
      ctx.drawImage(jetImage, jetX, jetY);
    }
    ctx.restore();
  };

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    } else {
      if (tilt) {
        const speed = 5;
        jetPosXRef.current += speed * Math.cos(Math.PI / 4);
        jetPosYRef.current += speed * Math.sin(Math.PI / 4);
      } else {
        jetPosXRef.current += 5;
      }
      draw();
      if (isRunning) {
        requestRef.current = requestAnimationFrame(animate);
      }
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
    }
  };

  useEffect(() => {
    if (isRunning) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [isRunning]);
  const gameOdds = Math.exp(0.00006 * elapsedTime).toFixed(2);

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
          }}
        >
          {gameOdds} X
        </h1>
        <h2></h2>
      </div>
      <div>
        <button onClick={handleStart}>{isRunning ? "Stop" : "Start"}</button>
      </div>
    </div>
  );
};

export default App;
