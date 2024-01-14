"use client";
import { cn } from "@/lib/utils";
import { createContext, useEffect, useState } from "react";
import Connecting from "../../app-composition/cards/connecting-card/connecting-card";
import { Error } from "../../app-composition/cards/error-card/error-card";
import InputCard from "../../app-composition/cards/input-card/input-card";
import Loading from "../../app-composition/cards/loading-card/loading-card";
import Video from "../../app-composition/cards/video-card/video-card";
import { LoadingState, type IContext } from "./types";

function CardContainer({ children }: { children: JSX.Element }) {
    return (
        <div className="grid items-start">
            <div className={cn("flex items-center justify-center [&>div]:w-full")}>{children}</div>
        </div>
    );
}

export const CurrentStateContext = createContext<IContext>({
    state: LoadingState.WAITING,
    videoProgress: 0,
    setVideoProgress: () => {
        undefined;
    },
    videoId: "",
    setVideoId: () => {
        undefined;
    },
    setState: () => {
        undefined;
    },
});

function PageLayout() {
    const [state, setState] = useState<LoadingState>(LoadingState.WAITING);
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [videoProgress, setVideoProgress] = useState<number>(0);
    const [videoId, setVideoId] = useState<string>("");

    const InputSide = () => {
        const InputSideInside = () => {
            switch (state) {
                case LoadingState.WAITING:
                case LoadingState.SUCCESS:
                case LoadingState.ERROR:
                    return <InputCard />;
                case LoadingState.CONNECTING:
                    return <Connecting />;
                case LoadingState.LOADING:
                    return <Loading videoId={videoId} videoProgress={videoProgress} />;
                default:
                    return null;
            }
        };

        return (
            <CardContainer>
                <InputSideInside />
            </CardContainer>
        );
    };

    const VideoSide = (): JSX.Element | null => {
        switch (state) {
            case LoadingState.SUCCESS:
            case LoadingState.ERROR:
                break;
            default:
                return null;
        }

        const VideoSideInside = (): JSX.Element => {
            switch (state) {
                case LoadingState.SUCCESS:
                    return <Video url={videoUrl} />;
                case LoadingState.ERROR:
                    return <Error />;
            }
        };

        return (
            <CardContainer>
                <VideoSideInside />
            </CardContainer>
        );
    };

    useEffect(() => {
        if (state === LoadingState.SUCCESS && videoId) {
            setVideoUrl(`${window.location.origin}/api/video?videoId=${videoId}`);
        }
    }, [state, videoId]);

    const contextValues: IContext = {
        state,
        setState,
        videoProgress,
        setVideoProgress,
        videoId,
        setVideoId,
    };

    return (
        <CurrentStateContext.Provider value={contextValues}>
            <InputSide />
            <VideoSide />
        </CurrentStateContext.Provider>
    );
}

export default PageLayout;
