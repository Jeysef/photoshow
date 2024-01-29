import { env } from "@/env";
import type { FullVideoId } from "@/types/types";
import path from "path";

export function getDestinationPath(videoId: FullVideoId) {
    return path.resolve(process.cwd(), env.NEXT_PUBLIC_DIRS_DIR, videoId);
}
