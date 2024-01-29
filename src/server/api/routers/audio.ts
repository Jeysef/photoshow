import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const audioRouter = createTRPCRouter({
    getAllAudioNames: publicProcedure.query(() => {
        return getAudioNames();
    }),
});

export async function getAudioNames() {
    const moodsFile = (await import("@/../moods/moods.json")).default;
    return moodsFile.map((mood) => mood.name);
}
