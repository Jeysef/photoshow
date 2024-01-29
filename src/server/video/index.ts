import type { FullVideoId, ISubmitProps, VideoId } from "@/types/types";
import { utapi } from "../uploadthing";
import { Configurator } from "./configurator";
import logger from "./logger";
import { LoggerEmoji, LoggerState } from "./logger/enums";
import Edit from "./runner/Edit";
import clearAfter from "./runner/clearAfter";
import { getDestinationPath } from "./runner/destinationPath";
import saveImages, { getVideoFile } from "./runner/fileLoader";
import { runFFmpeg } from "./runner/runFFmpeg";
import type { IDestination } from "./types/interfaces";

export default async function (props: ISubmitProps) {
    const { formData, config, userId } = props;
    const videoId: VideoId = crypto.randomUUID();
    const fullVideoId: FullVideoId = `${userId}/${videoId}`;

    try {
        const { imagePaths } = await saveImages({ formData, videoId: fullVideoId });

        const destination: IDestination = { name: "video", src: getDestinationPath(fullVideoId) };
        config.soundtrack = undefined;

        const configuration = new Configurator({ config, images: imagePaths, destination }).construct();
        const data = new Edit(configuration);

        const stream = runFFmpeg(data, videoId, onDone, clearAfter.bind(null, fullVideoId));
        return { videoId, stream };
    } catch (err) {
        logger.log(LoggerState.ERROR, LoggerEmoji.ERROR, `Error processing video ${videoId}`);
        console.error(err);
        return;
    }
}

async function onDone(videoPath: string, videoId: string) {
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
