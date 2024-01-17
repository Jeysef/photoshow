import { DIRS_PATH } from "@/constants";
import path from "path";

export function getDestinationPath(videoId: string) {
    return path.resolve(process.cwd(), DIRS_PATH, videoId);
}
