// src/App.tsx

import React, { useState, useEffect } from "react";
import Sprite from "./components/Sprite";
import { Frame } from "./components/types/sprite";

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
  const [imageSrc, setImageSrc] = useState("");
  const [json, setJson] = useState<JsonData | null>(null);
  const [currentSprite, setCurrentSprite] = useState(0);
  
  useEffect(() => {
    const loadSprite = async (spriteName: string) => {
      const image = await import(`./assets/images/${spriteName}.png`);
      const json = await import(`./assets/data/${spriteName}.json`);
      setImageSrc(image.default);
      setJson(json.default);
    };

    loadSprite(sprites[currentSprite]);

    const interval = setInterval(() => {
      setCurrentSprite((prevSprite) => (prevSprite + 1) % sprites.length);
    }, 2000);
  
  

    return () => clearInterval(interval);
  }, [currentSprite]);







  return imageSrc && json ? <Sprite imageSrc={imageSrc} json={json} /> : null;
};

export default App;