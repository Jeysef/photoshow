import type { FullVideoId } from "@/types/types";
import logger from "../logger";
import { LoggerEmoji, LoggerState } from "../logger/enums";
import { deleteVideoFolder } from "./fileLoader";

export default function clearAfter(videoId: FullVideoId) {
    logger.log(LoggerState.DEBUG, LoggerEmoji.DEBUG, "Clearing after videoId: " + videoId);
    void deleteVideoFolder(videoId);
}
