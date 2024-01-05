import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({ name: z.string().min(1) })).mutation(async ({ ctx }) => {
        return ctx.db.post.create({
            data: {
                authorId: "sdsds",
                videoId: "sdsds",
            },
        });
    }),

    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.post.findMany();
    }),
});
