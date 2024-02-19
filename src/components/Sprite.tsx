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
  isAnimating: boolean; // Add this line
}

const Sprite: React.FC<SpriteProps> = ({ imageSrc, json, isAnimating }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const image = new Image();

  useEffect(() => {
    image.src = imageSrc;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    let currentFrame = 1;
    const totalFrames = Object.keys(json.frames).length;

    const animate = () => {
      if (context && canvas && json.frames && isAnimating) {
        requestAnimationFrame(animate);
        context.clearRect(0, 0, canvas.width, canvas.height);
        const spriteName = json.meta.image.split(".")[0];

        const frameData = json.frames[`${spriteName}/${currentFrame}`]?.frame;

        if (frameData) {
          // Calculate half the width and half the height
          const halfWidth = frameData.w / 2;
          const halfHeight = frameData.h / 2;

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

    if (isAnimating) {
      image.onload = animate;
    }
  }, [imageSrc, json, isAnimating]);

  return <canvas ref={canvasRef} />;
};


export default Sprite;
