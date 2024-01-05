/**
 * THIS FILE IS NOT INTEDNED TO BE IMPORTED
 * THIS FILE IS FOR REFERENCE ONLY
 */

// Interface for the "timeline" object
export interface ITimeline {
  soundtrack: ISoundtrack;
  background: string;
  fonts: IFont[];
  tracks: ITrack[];
  cache: boolean;
}

// Interface for the "soundtrack" object
export interface ISoundtrack {
  src: string;
  effect: string;
  volume: number;
}

// Interface for the "fonts" array
export interface IFont {
  src: string;
}

// Interface for the "tracks" array
export interface ITrack {
  clips: IClip[];
}

// Interface for the "clips" array
export interface IClip {
  asset: IAsset;
  start: number;
  length: number;
  fit: string;
  scale: number;
  position: string;
  offset: IOffset;
  transition: ITransition;
  effect: string;
  filter: string;
  opacity: number;
  transform: ITransform;
}

// Interface for the "asset" object
export interface IAsset {
  type: string;
  src: string;
  trim: number;
  volume: number;
  volumeEffect: string;
  crop: ICrop;
}

// Interface for the "crop" object
export interface ICrop {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

// Interface for the "offset" object
export interface IOffset {
  x: number;
  y: number;
}

// Interface for the "transition" object
export interface ITransition {
  in: string;
  out: string;
}

// Interface for the "transform" object
export interface ITransform {
  rotate: IRotate;
  skew: ISkew;
  flip: IFlip;
}

// Interface for the "rotate" object
export interface IRotate {
  angle: number;
}

// Interface for the "skew" object
export interface ISkew {
  x: number;
  y: number;
}

// Interface for the "flip" object
export interface IFlip {
  horizontal: boolean;
  vertical: boolean;
}

// Interface for the "output" object
export interface IOutput {
  format: string;
  resolution: string;
  aspectRatio: string;
  size: ISize;
  fps: number;
  scaleTo: string;
  quality: string;
  repeat: boolean;
  mute: boolean;
  range: Range;
  poster: IPoster;
  thumbnail: IThumbnail;
  destinations: IDestination[];
}

// Interface for the "size" object
export interface ISize {
  width: number;
  height: number;
}

// Interface for the "range" object
export interface IRange {
  start: number;
  length: number;
}

// Interface for the "poster" object
export interface IPoster {
  capture: number;
}

// Interface for the "thumbnail" object
export interface IThumbnail {
  capture: number;
  scale: number;
}

// Interface for the "destinations" array
export interface IDestination {
  provider: string;
  exclude: boolean;
}

// Interface for the "merge" array
export interface IMerge {
  find: string;
  replace: string;
}

// Interface for the "template" object
export interface ITemplate {
  timeline: ITimeline;
  output: IOutput;
}

// Interface for the main JSON object
export interface IApiJSON {
  timeline?: ITimeline;
  output?: IOutput;
  merge?: IMerge[];
  callback?: string;
  name?: string;
  template?: ITemplate;
}
