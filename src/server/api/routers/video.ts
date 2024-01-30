import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const videoRouter = createTRPCRouter({
    getUrlFromVideoId: privateProcedure.input(z.object({ videoId: z.string().or(z.null()) })).query(async ({ ctx, input }) => {
        console.log("🚀 ~ file: video.ts:9 ~ getUrlFromVideoId:privateProcedure.input ~ input.videoId:", input.videoId);
        if (!input.videoId) {
            return null;
        }
        // return (await utapi.getFileUrls(`${ctx.currentUserId}/${input.videoId}.mp4` satisfies FullVideoId))[0]?.url;
        // console.log(await new UTApi().listFiles({}));
        return "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    }),
});
