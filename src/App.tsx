import React, { useState, useEffect } from "react";
import Canvas from "./components/Canvas";
import JetImageSrc from "./assets/images/jet.png";
import BackgroundImageSrc from "./assets/images/canvas.jpg";

//hooks
import { useImage } from "./components/hooks/useImage";
import { useWindowDimensions } from "./components/hooks/useWindowDimensions";
import "./App.css";

const App: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);

  const dimensions = useWindowDimensions();
  //Load images
  const backgroundImage = useImage(BackgroundImageSrc);
  const jetImage = useImage(JetImageSrc);

  const drawBackground = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    dimensions: { width: number; height: number }
  ) => {
    if (image.complete) {
      ctx.drawImage(image, 0, 0, dimensions.width, dimensions.height);
    }
  };

  const drawJet = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    dimensions: { width: number; height: number }
  ) => {
    if (image.complete) {
      const jetX = dimensions.width * 0.1;
      let jetY = dimensions.height * 0.85 - image.height / 2;
      const jetWidth = Math.max(dimensions.width / 10, 70);
      const jetHeight = (image.height / image.width) * jetWidth;
      if (jetY + jetHeight > dimensions.height) {
        jetY = dimensions.height - jetHeight;
      }
      ctx.drawImage(image, jetX, jetY, jetWidth, jetHeight);
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    drawBackground(ctx, backgroundImage, dimensions);
    drawJet(ctx, jetImage, dimensions);
  };

  return (
    <div className="App">
      <div></div>
      <Canvas draw={draw} width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default App;
