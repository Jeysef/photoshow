import { SubmitTripIdReturn, type IProcessInfo, type ISubmitProps, type ISubmitReturnProps, type VideoId } from "../types/types";
import Controller from "./controller/controller";
import { LoggerEmoji, LoggerState } from "./controller/enums";
import saveImages from "./controller/fileLoader";
import Logger from "./controller/logger";
import { createShow } from "./controller/runFFmpeg";
import { getDestinationPath } from "./helpers";

export async function createPhotoshow(props: ISubmitProps): Promise<ISubmitReturnProps> {
    console.log("Submitted");
    const { formData, config, userId } = props;
    console.log("🚀 ~ file: createShow.ts:12 ~ createPhotoshow ~ config:", config);

    const videoId = userId + "/" + crypto.randomUUID();

    Controller.startProcess(videoId, userId);

    // load images
    saveImages({ formData, videoId })
        .then(({ imagePaths }) => {
            const path = { src: getDestinationPath(videoId), name: "video" };
            const { progress, duration } = createShow({ config, images: imagePaths, destination: path });
            Controller.addVideo({ videoId, progress, duration });
        })
        .catch((err) => {
            Logger.log(LoggerState.ERROR, LoggerEmoji.ERROR, err as string);
            throw new Error(err as string);
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
