import React, { useEffect, useRef, useState } from "react";
import JetImage from "./assets/images/jet.png";
import RoadImage from "./assets/images/Road.png";
import BackgroundImage from "./assets/images/canvas.jpg";
import "./App.css";

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const jetPosXRef = useRef(0); // Use a ref to track the jet's X position
  const requestRef = useRef<number>(); // Use a ref to track the requestAnimationFrame ID

  // Load images
  const backgroundImage = new Image();
  backgroundImage.src = BackgroundImage;
  const roadImage = new Image();
  roadImage.src = RoadImage;
  const jetImage = new Image();
  jetImage.src = JetImage;

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      // Draw road
      ctx.drawImage(
        roadImage,
        0,
        canvas.height - roadImage.height,
        canvas.width,
        roadImage.height
      );

      // Draw jet
      ctx.drawImage(
        jetImage,
        jetPosXRef.current,
        canvas.height - roadImage.height,
        jetImage.width,
        jetImage.height
      );
    }
  };
  const [jetImageWidth, setJetImageWidth] = useState(0);
  useEffect(() => {
    const jetImage = new Image();
    jetImage.src = JetImage;
    jetImage.onload = () => {
      // Once the jet image is loaded, update the state with its width
      setJetImageWidth(jetImage.width);
    };
  }, []);

  const update = () => {
    if (canvasRef.current && jetImageWidth > 0) {
      // Ensure jetImageWidth is known
      jetPosXRef.current += 2;
      if (jetPosXRef.current > canvasRef.current.width) {
        jetPosXRef.current = -jetImageWidth; // Use state for jet image width
      }
    }
  };

  const animate = () => {
    draw();
    update();

    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth * 0.9;
      canvas.height = window.innerHeight * 0.8;
      draw(); // Initial drawing to show the jet and background
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        draw(); // Redraw the last position of the jet when stopped
      }
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning]);

  return (
    <div className="App">
      <canvas ref={canvasRef} style={{ border: "1px solid red" }} />
      <div>
        {" "}
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
};

export default App;
