import type { FormFieldNames, FormValues } from "@/components/pages/edit/formSchema";
import type { OutputResolution } from "@/server/video/types/enums";
import type { UploadData } from "@/server/video/types/types";
import type { MarkRequired } from "ts-essentials";
import type moods from "../../moods/moods.json";

export type Mood = (typeof moods)[number];

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

// export interface IStartProcessParams {
//     videoId: VideoId;
//     progress: FFMpegProgress;
//     duration: number;
// }

type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;

export type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
export type RangeIncl<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> | T;

export type UserId = string;
export type VideoId = string;
export type FullVideoId = `${UserId}/${VideoId}`;

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
    soundtrack?: Mood["name"];
    resolution?: OutputResolution;
    orientation?: OrientationType;
    title?: string;
}

export interface ISubmitProps {
    config: MarkRequired<FormValues, FormFieldNames.FILES>;
    userId: UserId;
}

export interface ISubmitReturnProps {
    state: SubmitTripIdReturn;
    videoId: VideoId;
}

export type IMood = Mood;
export enum ShowStreamType {
    PROGRESS = "PROGRESS",
    VIDEO_URL = "VIDEO_URL",
    VIDEO_RENDERING = "VIDEO_RENDERING",
}

export type IShowStreamData =
    | {
          type: ShowStreamType.PROGRESS;
          progress: number;
      }
    | ({
          type: ShowStreamType.VIDEO_URL;
      } & UploadData)
    | {
          type: ShowStreamType.VIDEO_RENDERING;
      };
