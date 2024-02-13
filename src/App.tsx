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

  //Odds
  // Keep track of the actual elapsed time in milliseconds
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth * 0.9;
      canvas.height = window.innerHeight * 0.8;
      // Ensure the initial draw happens after canvas setup
      draw();
    }
  }, []);

  useEffect(() => {
    if (isRunning) {

      setTimeout(() => setTilt(true), 2000); // Trigger tilt after 2 seconds
      requestRef.current = requestAnimationFrame(animate);
    } else {
      // Reset positions and tilt when animation stops
      stopTimer();
      jetPosXRef.current = 0;
      jetPosYRef.current = 0;
      setTilt(false);
      draw(); // Redraw to show the jet in the initial position
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning, tilt]);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      roadImage,
      0,
      canvas.height - roadImage.height,
      canvas.width,
      roadImage.height
    );

    // Adjust the jet's drawing based on the tilt state
    const radians = tilt ? Math.PI / 4 : 0; // Convert 45 degrees to radians
    const jetX = jetPosXRef.current;
    const jetY =
      canvas.height - roadImage.height - jetImage.height - jetPosYRef.current;

    ctx.save();
    if (tilt) {
      // Apply rotation around the jet's center for tilting
      ctx.translate(jetX + jetImage.width / 2, jetY + jetImage.height / 2);
      ctx.rotate(-radians);
      ctx.drawImage(jetImage, -jetImage.width / 2, -jetImage.height / 2);
    } else {
      // No tilt, draw jet at current position
      ctx.drawImage(jetImage, jetX, jetY);
    }
    ctx.restore();
  };

  const animate = (timestamp: number) => {
    // Explicitly type timestamp as number
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

  // Load images outside of the draw function to avoid reloading them on each call
  const backgroundImage = new Image();
  backgroundImage.src = BackgroundImageSrc;
  const roadImage = new Image();
  roadImage.src = RoadImageSrc;
  const jetImage = new Image();
  jetImage.src = JetImageSrc;

  const startTimeRef = useRef<number | null>(null);

  //Odds Component

  const startTimer = () => {
    const startTime = performance.now();
    intervalRef.current = window.setInterval(() => {
      // Update the actual elapsed time
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

  const resetTimer = () => {
    setElapsedTime(0); // Reset actual elapsed time
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
  const displayedTime = Math.exp(0.00006 * elapsedTime);

  const handleStart = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    if (isRunning) {
      resetTimer();
      startTimer();
    } else {
      stopTimer();
    }
  }, [isRunning]);

  return (
    <div className="App">
      <canvas ref={canvasRef} style={{ border: "1px solid red" }} />
      <h2>Odds: {displayedTime.toFixed(2)}</h2>
      <button onClick={handleStart}>{isRunning ? "Stop" : "Start"}</button>
    </div>
  );
};

export default App;
