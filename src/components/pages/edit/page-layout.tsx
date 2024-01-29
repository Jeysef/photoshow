"use client";
import { cn } from "@/lib/utils";
import { createContext, useContext, useState } from "react";
import Connecting from "../../app-composition/cards/connecting-card/connecting-card";
import { Error } from "../../app-composition/cards/error-card/error-card";
import InputCard from "../../app-composition/cards/input-card/input-card";
import Loading from "../../app-composition/cards/loading-card/loading-card";
import Video from "../../app-composition/cards/video-card/video-card";
import { LoadingState, type IContext } from "./types";
import useUploader from "./uploader";

function CardContainer({ children }: { children: JSX.Element }) {
    return (
        <div className="grid items-start">
            <div className={cn("flex items-center justify-center [&>div]:w-full")}>{children}</div>
        </div>
    );
}

export const CurrentStateContext = createContext<IContext>(undefined as unknown as IContext);

function PageLayout() {
    const [state, setState] = useState<LoadingState>(LoadingState.WAITING);
    const { error, isUploading, progress, upload, videoId, videoUrl } = useUploader({
        setState,
    });

    const contextValues: IContext = {
        state,
        error,
        isUploading,
        progress,
        upload,
        videoId,
        videoUrl,
    };

    return (
        <CurrentStateContext.Provider value={contextValues}>
            <InputSide />
            <VideoSide />
        </CurrentStateContext.Provider>
    );
}

export default PageLayout;

function InputSide() {
    const { state } = useContext(CurrentStateContext);
    const Content = () => {
        switch (state) {
            case LoadingState.WAITING:
            case LoadingState.SUCCESS:
            case LoadingState.ERROR:
                return <InputCard />;
            case LoadingState.CONNECTING:
                return <Connecting />;
            case LoadingState.VIDEO_RENDERING:
            case LoadingState.VIDEO_UPLOADING:
                return <Loading />;
        }
    };

    return (
        <CardContainer>
            <Content />
        </CardContainer>
    );
}

function VideoSide() {
    const { state } = useContext(CurrentStateContext);
    if (state !== LoadingState.SUCCESS && state !== LoadingState.ERROR) {
        return null;
    }

    const Content = () => {
        switch (state) {
            case LoadingState.SUCCESS:
                return <Video />;
            case LoadingState.ERROR:
                return <Error />;
        }
    };

    return (
        <CardContainer>
            <Content />
        </CardContainer>
    );
}
