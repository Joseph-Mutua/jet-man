import { SpriteJson } from "../components/types";

export const extractSpriteFrames= (spriteJson: SpriteJson) =>{
  return Object.values(spriteJson.frames).map((frameData) => ({
    ...frameData,
    frame: {
      x: frameData.frame.x,
      y: frameData.frame.y,
      width: frameData.frame.w,
      height: frameData.frame.h,
    },
  }));
}
