import fireOneJson from "../assets/data/Fire1.json";
import fireTwoJson from "../assets/data/Fire2.json";
import fireThreeJson from "../assets/data/Fire3.json";
import fireFourJson from "../assets/data/Fire4.json";
import boomJson from "../assets/data/Boom.json";
import loaderJson from "../assets/data/Loader.json";
import loaderwindowOneJson from "../assets/data/LoaderWindow0.json";
import loaderWindowTwoJson from "../assets/data/LoaderWindow1.json";

export type SpriteJson =
  | typeof fireOneJson
  | typeof fireTwoJson
  | typeof fireThreeJson
  | typeof fireFourJson
  | typeof boomJson
  | typeof loaderJson
  | typeof loaderwindowOneJson
  | typeof loaderWindowTwoJson;

export type ParachuteObject = {
  url: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  downwardSpeed: number;
  switchToDownward: boolean;
};

export type MovingImageObject = {
  url: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
};
