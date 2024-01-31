import type { FullVideoId, ISubmitProps, VideoId } from "@/types/types";
import { Configurator } from "./configurator";
import logger from "./logger";
import { LoggerEmoji, LoggerState } from "./logger/enums";
import Edit from "./runner/Edit";
import clearAfter from "./runner/clearAfter";
import { getDestinationPath } from "./runner/destinationPath";
import saveImages from "./runner/fileLoader";
import { runFFmpeg } from "./runner/runFFmpeg";
import type { IDestination } from "./types/interfaces";
import { uploadFile } from "./uploader";

export default async function (props: ISubmitProps) {
    const { config, userId } = props;
    const videoId: VideoId = crypto.randomUUID();
    const fullVideoId: FullVideoId = `${userId}/${videoId}`;

    try {
        const { imagePaths } = await saveImages({ images: config.files, videoId: fullVideoId });

        const destination: IDestination = { name: "video", src: getDestinationPath(fullVideoId) };
        config.soundtrack = undefined;

        const configuration = new Configurator({ config, images: imagePaths, destination }).construct();
        const data = new Edit(configuration);

        const stream = runFFmpeg(
            data,
            videoId,
            (videoDestination: string, videoId: VideoId) => uploadFile(videoDestination, videoId, userId),
            clearAfter.bind(null, fullVideoId),
        );
        return { videoId, stream };
    } catch (err) {
        logger.log(LoggerState.ERROR, LoggerEmoji.ERROR, `Error processing video ${videoId}`);
        console.error(err);
        return;
    }
}
