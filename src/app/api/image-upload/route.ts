import { createPhotoshow } from "@/core/createShow";
import { SubmitTripIdReturn } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";
import z from "zod";

const routeResponse = z.object({
    state: z.nativeEnum(SubmitTripIdReturn),
    videoId: z.string(),
});

type RouteResponse = z.infer<typeof routeResponse>;

export const POST = async (request: NextRequest): Promise<Response> => {
    const userId = (await currentUser())?.id;
    if (!userId) {
        const data: RouteResponse = { state: SubmitTripIdReturn.ERROR, videoId: "" };
        return parseData(data);
    }
    const config = Object.fromEntries(request.nextUrl.searchParams.entries());
    const formData = await request.formData();
    return parseData(await createPhotoshow({ config, formData, userId }));
};

function parseData(data: RouteResponse): Response {
    const parseResult = routeResponse.safeParse(data);
    if (!parseResult.success) {
        return Response.error();
    }
    return Response.json(parseResult);
}
