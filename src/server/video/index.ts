import type { ISubmitProps, VideoId } from "@/types/types";
import { utapi } from "../uploadthing";
import { Configurator } from "./configurator";
import logger from "./logger";
import { LoggerEmoji, LoggerState } from "./logger/enums";
import Edit from "./runner/Edit";
import { getDestinationPath } from "./runner/destinationPath";
import saveImages, { getVideoFile } from "./runner/fileLoader";
import { runFFmpeg } from "./runner/runFFmpeg";
import type { IDestination } from "./types/interfaces";

export default async function (props: ISubmitProps) {
    const { formData, config, userId } = props;
    const videoId: VideoId = crypto.randomUUID();
    const _internalVideoId = userId + "/" + videoId;

    try {
        const { imagePaths } = await saveImages({ formData, videoId: _internalVideoId });

        const destination: IDestination = { name: "video", src: getDestinationPath(_internalVideoId) };
        config.soundtrack = undefined;

        const configuration = new Configurator({ config, images: imagePaths, destination }).construct();
        const data = new Edit(configuration);

        const stream = runFFmpeg(data, videoId, onDone);
        return { videoId, stream };
    } catch (err) {
        logger.log(LoggerState.ERROR, LoggerEmoji.ERROR, `Error processing video ${videoId}`);
        console.error(err);
        return;
    }
}

async function onDone({ videoPath, videoId }: { videoPath: string; videoId: string }) {
    async function uploadFiles(file: File) {
        logger.log(LoggerState.INFO, LoggerEmoji.UPLOAD, `Uploading video ${videoId} to uploadthing`);
        const response = await utapi.uploadFiles([file]);
        return response;
    }
    // load file from videoPath
    const res = await uploadFiles(getVideoFile(videoPath, videoId));
    const response = res[0];
    if (!response) {
        throw new Error("Upload failed");
    }
    const error = response.error;
    if (error) {
        throw new Error(error.message);
    }
    logger.log(LoggerState.SUCCESS, LoggerEmoji.UPLOAD, `Uploaded video ${videoId} to ${response.data.url}`);
    return response.data.url;
}
