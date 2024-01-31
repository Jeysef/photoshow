import { FormFieldNames, type FormValues } from "@/components/pages/edit/formSchema";
import video from "@/server/video";
import logger from "@/server/video/logger";
import { LoggerEmoji, LoggerState } from "@/server/video/logger/enums";
import { SubmitTripIdReturn, type ISubmitProps, type VideoId } from "@/types/types";
import { getEnumValues } from "@/utils/utils";
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
        logger.log(LoggerState.ERROR, LoggerEmoji.ERROR, "Unauthorized user");
        const res: RouteResponse = { state: SubmitTripIdReturn.ERROR, videoId: "" };
        return Response.json(res);
    }
    const formData = await request.formData();
    const config = parseFormData(formData);

    const data = await video({ config, userId });

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

function parseFormData(formData: FormData) {
    const formFieldNames = getEnumValues(FormFieldNames);
    const config = formFieldNames.reduce((acc, fieldName) => {
        const value =
            fieldName === FormFieldNames.FILES
                ? (formData.getAll(fieldName) as FormValues[typeof fieldName])
                : (formData.get(fieldName)! as FormValues[typeof fieldName]);
        return value ? { ...acc, [fieldName]: value } : acc;
    }, {} as FormValues) as ISubmitProps["config"];
    return config;
}

export const runtime = "nodejs";
export const revalidate = 0;
export const dynamic = "force-dynamic";
