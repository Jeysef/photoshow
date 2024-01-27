import { env } from "@/env";
import path from "path";

export function getDestinationPath(videoId: string) {
    return path.resolve(process.cwd(), env.NEXT_PUBLIC_DIRS_DIR, videoId);
}
