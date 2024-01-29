import { env } from "@/env";
import { iteratorToStream, nodeStreamToIterator } from "@/lib/stream";
import { getAudioNames } from "@/server/api/routers/audio";
import fs from "fs-extra";
import { NextResponse, type NextRequest } from "next/server";
import { resolve } from "path";

export const GET = async (request: NextRequest) => {
    const audioNames = await getAudioNames();

    try {
        const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
        const audioName = searchParams.audioName;
        if (!audioName || !audioNames.includes(audioName)) {
            return Response.json({ error: "Audio name not found" }, { status: 400 });
        }
        const musicsPath = env.NEXT_PUBLIC_SOUNDTRACKS_DIR;
        const musicPath = resolve(musicsPath, audioName);
        const nodeStream = fs.createReadStream(musicPath);
        const iterator = nodeStreamToIterator(nodeStream);
        const webStream = iteratorToStream(iterator);
        return new NextResponse(webStream, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
};

export const config = {
    api: {
        responseLimit: false,
    },
};
