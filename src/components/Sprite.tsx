import React, { useRef, useEffect } from "react";

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

const Sprite: React.FC<SpriteProps> = ({ imageSrc, json }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const image = new Image();

  useEffect(() => {
    image.src = imageSrc;
    

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");


    let currentFrame = 1;
    const totalFrames = Object.keys(json.frames).length;

    const animate = () => {

      if (context && canvas && json.frames) {
        requestAnimationFrame(animate);
        context.clearRect(0, 0, canvas.width, canvas.height);
        const spriteName = json.meta.image.split(".")[0];

        const frameData =
          json.frames[`${spriteName}/${currentFrame}`]?.frame;

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


      }

    };

    image.onload = animate;
  }, [imageSrc, json]);

  return <canvas ref={canvasRef} />;

};

export default Sprite;