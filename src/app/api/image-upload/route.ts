import { FormFieldNames } from "@/components/pages/edit/formSchema";
import video from "@/server/video";
import type { OutputResolution } from "@/server/video/types/enums";
import { SubmitTripIdReturn, type IConfig, type Mood, type OrientationType, type VideoId } from "@/types/types";
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
    const formData = await request.formData();
    const config: IConfig = {
        soundtrack: formData.get(FormFieldNames.SOUNDTRACK) as Mood["name"],
        resolution: formData.get(FormFieldNames.RESOLUTION) as OutputResolution,
        orientation: formData.get(FormFieldNames.ORIENTATION) as OrientationType,
        title: formData.get(FormFieldNames.TITLE) as string,
    };

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
