// import React, { useState, useEffect } from "react";
// import JetImage from "./assets/images/jet.png";

// import "./App.css";

// const App: React.FC = () => {
//   const [isRunning, setIsRunning] = useState<boolean>(false);
//   const [counter, setCounter] = useState<number>(0.0);
//   const [randomNumber, setRandomNumber] = useState<number>(0.0);

//   useEffect(() => {
//     let intervalId: NodeJS.Timeout;

//     if (isRunning) {
//       setRandomNumber(parseFloat((Math.random() * 10 + 1).toFixed(2)));
//       intervalId = setInterval(() => {
//         setCounter((prevCounter) => {
//           const newCounter = parseFloat((prevCounter + 0.01).toFixed(2));
//           if (newCounter >= randomNumber) {
//             setIsRunning(false);
//             clearInterval(intervalId);
//           }
//           return newCounter;
//         });
//       }, 100);
//     } else {
//       setCounter(0.0);
//     }

//     return () => clearInterval(intervalId);
//   }, [isRunning, randomNumber]);

//   const handleStartClick = () => {
//     setIsRunning(!isRunning);
//   };

//   return (
//     <div className="App">
//       <div className="night">
//         <div className={isRunning ? "surface moveRight" : "surface"}></div>
//         <div className={isRunning ? "jet moveUpwards" : "jet"}>
//           <img src={JetImage} alt="jet" />
//         </div>
//       </div>
//       <div style={{ marginBottom: "50px" }}>
//         <button onClick={handleStartClick}>
//           {isRunning ? "Stop" : "Start"}
//         </button>
//       </div>
//       <div style={{ color: "green", fontSize: "2rem", textAlign: "center" }}>
//         {counter.toFixed(2)}
//       </div>
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect, useRef } from "react";
import JetImage from "./assets/images/jet.png";
import AirpotImage from "./assets/images/Airport.png";
import RoadSurface from "./assets/images/Img_02.png";
import "./App.css";

function App() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const jetImageRef = useRef(new Image());
  const airpotImageRef = useRef(new Image());
  const roadSurfaceImageRef = useRef(new Image());

  const handleStartClick = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if(!context) return;

    context.imageSmoothingEnabled = false;
    let animationFrameId: number;
    let x = 0;

    const render = () => {
      if (!isRunning) {
        window.cancelAnimationFrame(animationFrameId);
        return;
      }

      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the images
      // const airpotHeight = canvas.height * 0.5; // 50% of the canvas height
      // const airpotWidth =
      //   airpotImageRef.current.width *
      //   (airpotHeight / airpotImageRef.current.height); // Keep the original aspect ratio
      // context.drawImage(
      //   airpotImageRef.current,
      //   x,
      //   canvas.height - airpotHeight,
      //   airpotWidth,
      //   airpotHeight
      // );

      const roadSurfaceHeight = canvas.height * 0.2; // 20% of the canvas height
      const roadSurfaceWidth =
        roadSurfaceImageRef.current.width *
        (roadSurfaceHeight / roadSurfaceImageRef.current.height); // Keep the original aspect ratio

      for (let i = -1; i < canvas.width / roadSurfaceWidth + 1; i++) {
        context.drawImage(
          roadSurfaceImageRef.current,
          x + i * roadSurfaceWidth,
          canvas.height - roadSurfaceHeight,
          roadSurfaceWidth,
          roadSurfaceHeight
        );
      }
      const jetHeight = canvas.height * 0.075; // 7.5% of the canvas height
      const jetWidth =
        jetImageRef.current.width * (jetHeight / jetImageRef.current.height); // Keep the original aspect ratio
      context.drawImage(
        jetImageRef.current,
        canvas.width * 0.24,
        canvas.height - jetHeight,
        jetWidth,
        jetHeight
      );

      // Move the road surface
      x -= 1;
      if (x < -roadSurfaceWidth) {
        x = 0;
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    // Load the images and start the animation when they're ready
    jetImageRef.current.onload = render;
    jetImageRef.current.src = JetImage;
    airpotImageRef.current.src = AirpotImage;
    roadSurfaceImageRef.current.src = RoadSurface;

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning]);

  return (
    <div className="App">
      <canvas ref={canvasRef} className="night" />

      <div style={{ marginBottom: "50px" }}>
        <button onClick={handleStartClick}>
          {isRunning ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
}

export default App;

