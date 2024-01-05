"use server";
import path from "path";
import { DIRS_PATH } from "../constants";
import { type IProcessInfo, type ISubmitProps, type ISubmitReturnProps, ProcessState, SubmitTripIdReturn, type VideoId } from "../types/types";
import { generateVideoId } from "./auth";
import Controller from "./controller/controller";
import { LoggerEmoji, LoggerState } from "./controller/enums";
import imagesLoader from "./controller/fileLoader";
import Logger from "./controller/logger";
import { createShow } from "./controller/runFFmpeg";

export async function submit(props: ISubmitProps): Promise<ISubmitReturnProps> {
    console.log("Submitted")
    const { config } = props;

    // const userId = generateUserId();
    const videoId = generateVideoId();

    // error handling
    if (!DIRS_PATH) {
        Logger.log(LoggerState.ERROR, LoggerEmoji.ERROR, "DIRS_PATH is not provided");
        return {
            state: SubmitTripIdReturn.ERROR,
            videoId,
        };
    }

    // Logger.log(LoggerState.INFO, LoggerEmoji.START, `User ${userId} requested trip ${tripId}`);
    const stateOfProcess = Controller.getStateOfProcess(videoId);
    switch (stateOfProcess) {
        case ProcessState.ERROR:
        case ProcessState.NOT_FOUND:
            Controller.startProcess(videoId);
            Logger.log(LoggerState.INFO, LoggerEmoji.PROCESS, "Creating process");
            const destination = path.resolve( process.cwd(), DIRS_PATH, videoId)
            imagesLoader({...props, destination}).then(({ imagePaths }) => {
                const path = { src: destination, name: "video" };
                const { progress, duration } = createShow({ config, images: imagePaths, destination: path });
                Controller.addVideo({ videoId, progress, duration });
            }).catch((err) => {
                Logger.log(LoggerState.ERROR, LoggerEmoji.ERROR, err as string);
            });
            
            return {state: SubmitTripIdReturn.RUNNING, videoId};
        case ProcessState.LOADING_IMAGES:
        case ProcessState.LOADING_VIDEO:
            Logger.log(LoggerState.SUCCESS, LoggerEmoji.PROCESS, "Process already created");
            return {state: SubmitTripIdReturn.RUNNING, videoId};
        case ProcessState.SUCCESS:
            Logger.log(LoggerState.INFO, LoggerEmoji.UPLOAD, "Proces already finished.");
            return {state: SubmitTripIdReturn.FINISHED, videoId};
    }
}

export interface IGetProgressProps {
    videoId: VideoId;
}

export async function getProcessData(props: IGetProgressProps): Promise<false | IProcessInfo> {
    const { videoId } = props; 
    const progress = Controller.getProgress(videoId);
    return progress;
}
