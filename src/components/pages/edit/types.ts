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

export interface IContext extends ReturnType<typeof useUploader> {
    state: LoadingState;
    videoId: VideoId | null;
}
