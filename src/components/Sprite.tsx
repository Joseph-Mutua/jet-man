import React, { useRef, useEffect } from "react";

<<<<<<< HEAD
import { SpriteProps } from "./types";
=======
interface Frame {
  frame: { x: number; y: number; w: number; h: number };
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
}

interface SpriteJson {
  frames: Record<string, Frame>;
  meta: {
    image: string;
    scale: string;
    size: { w: number; h: number };
  };
}

interface SpriteProps {
  imageSrc: string;
  json: SpriteJson;
}
>>>>>>> 813901e3a2642bd17214c86f34a0e1cbaca98047

const Sprite: React.FC<SpriteProps> = ({ imageSrc, json }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const image = new Image();

  useEffect(() => {
    image.src = imageSrc;
<<<<<<< HEAD
=======
    
>>>>>>> 813901e3a2642bd17214c86f34a0e1cbaca98047

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

<<<<<<< HEAD
=======

>>>>>>> 813901e3a2642bd17214c86f34a0e1cbaca98047
    let currentFrame = 1;
    const totalFrames = Object.keys(json.frames).length;

    const animate = () => {
<<<<<<< HEAD
=======

>>>>>>> 813901e3a2642bd17214c86f34a0e1cbaca98047
      if (context && canvas && json.frames) {
        requestAnimationFrame(animate);
        context.clearRect(0, 0, canvas.width, canvas.height);
        const spriteName = json.meta.image.split(".")[0];

<<<<<<< HEAD
        const frameData = json.frames[`${spriteName}/${currentFrame}`]?.frame;
=======
        const frameData =
          json.frames[`${spriteName}/${currentFrame}`]?.frame;
>>>>>>> 813901e3a2642bd17214c86f34a0e1cbaca98047

        if (frameData) {
          context.drawImage(
            image,
            frameData.x,
            frameData.y,
            frameData.w,
            frameData.h,
            0,
            0,
            canvas.width,
            canvas.height
          );
          currentFrame = (currentFrame % totalFrames) + 1;
        }
<<<<<<< HEAD
      }
=======


      }

>>>>>>> 813901e3a2642bd17214c86f34a0e1cbaca98047
    };

    image.onload = animate;
  }, [imageSrc, json]);

  return <canvas ref={canvasRef} />;
<<<<<<< HEAD
};

export default Sprite;
=======

};

export default Sprite;
>>>>>>> 813901e3a2642bd17214c86f34a0e1cbaca98047
