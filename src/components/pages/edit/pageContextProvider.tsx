"use client";
import { useQueryState } from "next-usequerystate";
import { createContext, useState, type PropsWithChildren } from "react";
import { LoadingState, type IContext } from "./types";
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
        error,
        isUploading,
        progress,
        videoId,
        upload,
        videoUrl,
    };

    return <CurrentStateContext.Provider value={contextValues}>{props.children}</CurrentStateContext.Provider>;
}
export const CurrentStateContext = createContext<IContext>(undefined as unknown as IContext);
