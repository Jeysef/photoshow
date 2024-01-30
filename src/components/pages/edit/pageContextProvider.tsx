"use client";
import { useQueryState } from "next-usequerystate";
import { createContext, useState, type PropsWithChildren } from "react";
import { LoadingState, type IContext, type IVideoContext } from "./types";
import useUploader from "./uploader";

export default function PageContextProvider(props: PropsWithChildren) {
    const [videoId, setVideoId] = useQueryState("videoId", { shallow: false });
    const [state, setState] = useState<LoadingState>(videoId ? LoadingState.SUCCESS : LoadingState.WAITING);
    const { error, isUploading, progress, upload, videoUrl } = useUploader({
        setState,
        setVideoId,
    });

    const contextValues: IContext = {
        state,
    };
    const videoContextValues: IVideoContext = {
        error,
        isUploading,
        progress,
        upload,
        videoId,
        videoUrl,
    };

    return (
        <CurrentStateContext.Provider value={contextValues}>
            <VideoContext.Provider value={videoContextValues}>{props.children}</VideoContext.Provider>
        </CurrentStateContext.Provider>
    );
}
export const CurrentStateContext = createContext<IContext>(undefined as unknown as IContext);
export const VideoContext = createContext<IVideoContext>(undefined as unknown as IVideoContext);
