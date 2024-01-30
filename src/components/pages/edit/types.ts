import type { VideoId } from "@/types/types";
import type useUploader from "./uploader";

export enum LoadingState {
    WAITING = "Waiting",
    CONNECTING = "Connecting",
    VIDEO_RENDERING = "Loading",
    VIDEO_UPLOADING = "Uploading",
    SUCCESS = "Success",
    ERROR = "Error",
}

export interface IVideoLoadingState {
    state: LoadingState;
    url?: string;
}

export interface IContext {
    state: LoadingState;
}
export interface IVideoContext extends ReturnType<typeof useUploader> {
    videoId: VideoId | null;
}
