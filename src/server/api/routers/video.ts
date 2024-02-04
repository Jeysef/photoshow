import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { utapi } from "@/server/uploadthing";
import logger from "@/server/video/logger";
import { LoggerEmoji, LoggerState } from "@/server/video/logger/enums";
import { z } from "zod";

export const videoRouter = createTRPCRouter({
    getUrlFromVideoId: protectedProcedure.input(z.object({ videoId: z.string().or(z.null()) })).query(async ({ input }) => {
        const { videoId } = input;
        if (videoId) {
            return {
                url: (await utapi.getFileUrls(videoId))?.[0]?.url,
            };
        }
        logger.log(LoggerState.WARNING, LoggerEmoji.VIDEO, `Failed to get video url for ${videoId}.`);
        return {
            url: undefined,
        };
    }),
});
