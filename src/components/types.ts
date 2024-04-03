import fireOneJson from '../assets/data/Fire1.json';
import fireTwoJson from '../assets/data/Fire2.json';
import fireThreeJson from '../assets/data/Fire3.json';
import fireFourJson from '../assets/data/Fire4.json';

export type FireJson = typeof fireOneJson | typeof fireTwoJson | typeof fireThreeJson | typeof fireFourJson; 
interface Frame {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SpriteFrameData {
  [key: string]: { frame: Frame };
}

export interface Animation {
  url: string;
  frames: SpriteFrameData;
  animation: string[];
  x?: number;
  y?: number;
  currentFrameIndex?: number;
}


export interface ImageObject {
  url: string;
  x: number;
  y: number;
  minScroll: number;
  maxScroll: number;
  zIndex?: number;
}

// export interface AnimatedSprite {
//   url: string;
//   frames: SpriteFrames;
//   animation: string[];
//   currentFrameIndex: number;
// }


// export interface SpriteFrameData {
//   frames: {
//     [key: string]: {
//       frame: {
//         x: number;
//         y: number;
//         w: number;
//         h: number;
//       };
//     };
//   };
//   animations: {
//     [animationName: string]: string[];
//   };
//   meta: {
//     image: string;
//     scale: string;
//     size: { w: number; h: number };
//   };
// }


export interface SpriteFrame {
  frame: { x: number; y: number; w: number; h: number };
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
}

export interface SpriteSheet {
  frames: { [key: string]: SpriteFrame };
  animations: { [animationName: string]: string[] };
  meta: {
    app: string;
    version: string;
    image: string;
    format: string;
    size: { w: number; h: number };
    scale: string;
    smartupdate: string;
  };
}


