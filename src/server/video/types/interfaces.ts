import {
    type AssetType,
    type ConnectEffect,
    type EffectEffect,
    type FilterType,
    type FitType,
    type MotionEffect,
    type OutputAspectRatio,
    type OutputFPS,
    type OutputFormat,
    type OutputQuality,
    type OutputResolution,
    type TextPosition,
    type TitleSize,
    type TitleStyle,
    type VolumeEffect,
    type XFadeTransition,
} from "./enums";

// Interface for the "timeline" object
export interface ITimeline {
    soundtrack?: ISoundtrack;
    background?: string; // hex color, default: #000000
    fonts?: IFont[];
    tracks: ITrack[];
    cache: boolean;
}

// Interface for the "soundtrack" object
export interface ISoundtrack {
    src: string;
    effect?: VolumeEffect;
    volume?: number; // 0-1
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
    duration: number;
    fit?: FitType;
    scale?: number; // 0-1
    position?: TextPosition;
    offset?: IOffset;
    transition?: ITransition;
    effect?: IEffect[];
    filter?: FilterType;
    opacity?: number; // 0-1
    transform?: ITransform;
}

export type IAsset = IVideoAsset | IImageAsset | ITitleAsset | IHtmlAsset | IAudioAsset | ILumaAsset;

export interface IVideoAsset {
    type: AssetType.VIDEO;
    src: string;
    trim?: number;
    volume?: number; // 0-1
    volumeEffect?: VolumeEffect;
    crop?: ICrop;
}
export interface IImageAsset {
    type: AssetType.IMAGE;
    src: string;
    crop?: ICrop;
}
export interface ITitleAsset {
    type: AssetType.TITLE;
    text: string;
    style?: TitleStyle;
    color?: string; // hex color, default: #ffffff, transparent: #80ffffff (50% transparent)
    size?: TitleSize;
    background?: string; // hex color, default: #000000, transparent: #80000000 (50% transparent)
    position?: TextPosition;
    offset?: IOffset;
}
export interface IHtmlAsset {
    type: AssetType.HTML;
    html: string;
    css?: string;
    width?: number; // bounding box in pixels
    height?: number; // bounding box in pixels
    background?: string; // hex color, default: #000000, transparent: #80000000 (50% transparent)
    position?: TextPosition;
}
export interface IAudioAsset {
    type: AssetType.AUDIO;
    src: string;
    trim?: number;
    volume?: number; // 0-1
    effect?: VolumeEffect;
}

export interface ILumaAsset {
    type: AssetType.LUMA;
    src: string;
    trim?: number;
}

// Interface for the "crop" object
export interface ICrop {
    top: number; // 0-1
    bottom: number; // 0-1
    left: number; // 0-1
    right: number; // 0-1
}

// Interface for the "offset" object
export interface IOffset {
    x: number; // -10-10 positive: right, negative: left
    y: number;
}

// Interface for the "transition" object
export interface ITransition {
    in?: XFadeTransition;
    out?: XFadeTransition;
}

export interface IMotionEffect {
    type: MotionEffect;
    duration: number;
    speed: number; // speed multiplier
}
export interface IEffectEffect {
    type: EffectEffect;
    duration: number;
    speed: number; // speed multiplier
}
export interface IConnectEffect {
    type: ConnectEffect.CONNECT;
    duration: number;
    offset: number;
    transition?: XFadeTransition;
}
export interface ISplitEffect {
    type: ConnectEffect.SPLIT;
    stream1Duration: number;
    stream2Duration: number;
    connectDuration: number;
}

export type IEffect = IMotionEffect | IEffectEffect | IConnectEffect | ISplitEffect;

// Interface for the "transform" object
export interface ITransform {
    rotate: IRotate;
    skew: ISkew;
    flip: IFlip;
}

// Interface for the "rotate" object
export interface IRotate {
    angle: number; // 0-360 || -360-0
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
    format: OutputFormat;
    resolution?: OutputResolution;
    aspectRatio?: OutputAspectRatio;
    size?: ISize;
    fps?: OutputFPS;
    scaleTo?: OutputResolution;
    quality?: OutputQuality;
    repeat?: boolean;
    mute?: boolean;
    range?: IRange;
    poster?: IPoster;
    thumbnail?: IThumbnail;
    destinations?: IDestination[];
}

// Interface for the "size" object
export interface ISize {
    width: number; // divisible by 2
    height: number; // divisible by 2
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
    src: string;
    name: string;
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
}
