import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
    create: privateProcedure.input(z.object({ videoId: z.string().min(1) })).mutation(async ({ ctx, input }) => {
        return await ctx.db.post.create({
            data: {
                authorId: ctx.currentUserId,
                videoId: input.videoId,
            },
        });
    }),

    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.post.findMany();
    }),
});
