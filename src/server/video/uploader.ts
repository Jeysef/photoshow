import { utapi } from "../uploadthing";
import logger from "./logger";
import { LoggerEmoji, LoggerState } from "./logger/enums";
import { getVideoFile } from "./runner/fileLoader";
import type { UploadData } from "./types/types";

export async function uploadFile(videoPath: string, videoId: string, userId: string): Promise<UploadData> {
    async function uploadFiles(file: File) {
        logger.log(LoggerState.INFO, LoggerEmoji.UPLOAD, `Uploading video ${videoId} to uploadthing`);
        const response = await utapi.uploadFiles([file], {
            contentDisposition: "inline",
            // metadata: {
            //     "created-by": userId,
            //     "created-at": new Date().toISOString(),
            // },
        });
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
    return response.data;
}
