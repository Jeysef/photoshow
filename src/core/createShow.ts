"use server";
import { currentUser } from "@clerk/nextjs/server";
import path from "path";
import { DIRS_PATH } from "../constants";
import { SubmitTripIdReturn, type IProcessInfo, type ISubmitProps, type ISubmitReturnProps, type VideoId } from "../types/types";
import Controller from "./controller/controller";
import { LoggerEmoji, LoggerState } from "./controller/enums";
import imagesLoader from "./controller/fileLoader";
import Logger from "./controller/logger";
import { createShow } from "./controller/runFFmpeg";

export async function submit(props: ISubmitProps): Promise<ISubmitReturnProps> {
    console.log("Submitted");

    const userId = (await currentUser())?.id;
    if (!userId) {
        Logger.log(LoggerState.ERROR, LoggerEmoji.ERROR, "Unauthorized");
        return {
            state: SubmitTripIdReturn.ERROR,
            videoId: "",
        };
    }

    const { config } = props;

    // const userId = generateUserId();
    const videoId = userId + "/" + crypto.randomUUID();

    // error handling
    if (!DIRS_PATH) {
        Logger.log(LoggerState.ERROR, LoggerEmoji.ERROR, "DIRS_PATH is not provided");
        return {
            state: SubmitTripIdReturn.ERROR,
            videoId,
        };
    }

    Controller.startProcess(videoId);
    Logger.log(LoggerState.INFO, LoggerEmoji.PROCESS, "Creating process for user " + userId + " with videoId " + videoId);
    const destination = path.resolve(process.cwd(), DIRS_PATH, videoId);
    imagesLoader({ ...props, destination })
        .then(({ imagePaths }) => {
            const path = { src: destination, name: "video" };
            const { progress, duration } = createShow({ config, images: imagePaths, destination: path });
            Controller.addVideo({ videoId, progress, duration });
        })
        .catch((err) => {
            Logger.log(LoggerState.ERROR, LoggerEmoji.ERROR, err as string);
        });

    return { state: SubmitTripIdReturn.RUNNING, videoId };
}

export interface IGetProgressProps {
    videoId: VideoId;
}

export async function getProcessData(props: IGetProgressProps): Promise<false | IProcessInfo> {
    const { videoId } = props;
    const progress = Controller.getProgress(videoId);
    return progress;
}
