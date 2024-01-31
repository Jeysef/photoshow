import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { utapi } from "@/server/uploadthing";
import { z } from "zod";

export const videoRouter = createTRPCRouter({
    getUrlFromVideoId: privateProcedure.input(z.object({ videoId: z.string().or(z.null()) })).query(async ({ input }) => {
        const { videoId } = input;
        if (videoId) {
            return (await utapi.getFileUrls(videoId))?.[0]?.url;
        }
        // logger.log(LoggerState.ERROR, LoggerEmoji.UPLOAD, `Failed to get video url for ${videoId} with error`);
        return null;
    }),
});
