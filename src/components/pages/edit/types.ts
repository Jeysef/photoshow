
export enum LoadingState {
    WAITING = "Waiting",
    CONNECTING = "Connecting",
    LOADING = "Loading",
    SUCCESS = "Success",
    ERROR = "Error",
}

export interface IVideoLoadingState {
    state: LoadingState;
    url?: string;
}

export interface IContext {
    state: LoadingState
    videoProgress: number
    setVideoProgress: (progress: number) => void
    videoId: string
    setState: (state: LoadingState) => void
    setVideoId: (id: string) => void
}