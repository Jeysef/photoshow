import video from "@/server/video";
import logger from "@/server/video/logger";
import { LoggerEmoji, LoggerState } from "@/server/video/logger/enums";
import { SubmitTripIdReturn, type IConfig, type VideoId } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import { StreamingTextResponse } from "ai";
import { type NextRequest } from "next/server";

type RouteResponse = {
    state: SubmitTripIdReturn;
    videoId: VideoId;
};

export const POST = async (request: NextRequest) => {
    const userId = (await currentUser())?.id;
    if (!userId) {
        const res: RouteResponse = { state: SubmitTripIdReturn.ERROR, videoId: "" };
        return Response.json(res);
    }
    const config = Object.fromEntries(request.nextUrl.searchParams.entries()) as Partial<IConfig>;
    logger.log(LoggerState.DEBUG, LoggerEmoji.DEBUG, "Recieved config: " + JSON.stringify(config));
    const formData = await request.formData();
    const data = await video({ config, formData, userId });
    if (!data) {
        const data: RouteResponse = { state: SubmitTripIdReturn.ERROR, videoId: "" };
        return Response.json(data);
    }

    const jsonStringifyTransform = new TransformStream({
        transform(chunk, controller) {
            controller.enqueue(JSON.stringify(chunk));
        },
    });

    return new StreamingTextResponse(data.stream.pipeThrough(jsonStringifyTransform));
};

export const runtime = "nodejs";
export const revalidate = 0;
export const dynamic = "force-dynamic";
