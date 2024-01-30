"use client";
import { useContext, useMemo } from "react";
import Connecting from "../../app-composition/cards/connecting-card/connecting-card";
import { Error } from "../../app-composition/cards/error-card/error-card";
import InputCard from "../../app-composition/cards/input-card/input-card";
import Loading from "../../app-composition/cards/loading-card/loading-card";
import Video from "../../app-composition/cards/video-card/video-card";
import { CardContainer } from "./page-layout";
import { CurrentStateContext } from "./pageContextProvider";
import { LoadingState } from "./types";

export function InputSide() {
    const { state } = useContext(CurrentStateContext);

    const Content = useMemo(() => {
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
    }, [state]);

    return <CardContainer>{Content}</CardContainer>;
}
export function VideoSide() {
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
