import video from "@/server/video";
import { SubmitTripIdReturn, type IConfig } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import type { NextApiResponse } from "next";
import { type NextRequest } from "next/server";
import z from "zod";

const routeResponse = z.object({
    state: z.nativeEnum(SubmitTripIdReturn),
    videoId: z.string(),
});

type RouteResponse = z.infer<typeof routeResponse>;

export const POST = async (request: NextRequest, response: NextApiResponse) => {
    const userId = (await currentUser())?.id;
    if (!userId) {
        const data: RouteResponse = { state: SubmitTripIdReturn.ERROR, videoId: "" };
        return parseData(data);
    }
    const config = Object.fromEntries(request.nextUrl.searchParams.entries()) as Partial<IConfig>;
    const formData = await request.formData();
    const data = await video({ config, formData, userId });
    if (!data) {
        const data: RouteResponse = { state: SubmitTripIdReturn.ERROR, videoId: "" };
        return parseData(data);
    }

    return Response.json({ state: SubmitTripIdReturn.RUNNING, videoId: data.videoId });
};

function parseData(data: RouteResponse): Response {
    const parseResult = routeResponse.safeParse(data);
    if (!parseResult.success) {
        return Response.error();
    }
    return Response.json(parseResult);
}

export const revalidate = true;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
