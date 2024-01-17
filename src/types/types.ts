import { type FFMpegProgress } from "ffmpeg-progress-wrapper";
import { type OutputResolution } from "../core/schemas/enums";

export enum ProcessState {
    LOADING_IMAGES = "LOADING_IMAGES",
    LOADING_VIDEO = "LOADING_VIDEO",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    NOT_FOUND = "NOT_FOUND",
}

export interface IProcessMeta {
    photoProgress?: RangeIncl<0, 100>;
    videoProgress?: RangeIncl<0, 100>;
    videoDuration?: number;
    videoId: VideoId;
    /**
     * Time when the process started in milliseconds
     * reason: tracking
     */
    startTime: number;
}
export interface IProcessInfo {
    state: ProcessState;
    meta: IProcessMeta;
}

export interface IStartProcessParams {
    videoId: VideoId;
    progress: FFMpegProgress;
    duration: number;
}

type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;

export type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
export type RangeIncl<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> | T;

export type VideoId = string;

export enum SubmitTripIdReturn {
    RUNNING = "RUNNING",
    ERROR = "ERROR",
    FINISHED = "FINISHED",
}

export enum OrientationType {
    LANDSCAPE = "LANDSCAPE",
    PORTRAIT = "PORTRAIT",
}

export interface IConfig {
    soundtrack?: string;
    resolution?: OutputResolution;
    orientation?: OrientationType;
    title?: string;
}

export interface ISubmitProps {
    formData: FormData;
    config: IConfig;
    userId: string;
}

export interface ISubmitReturnProps {
    state: SubmitTripIdReturn;
    videoId: VideoId;
}

export type UserId = string;
