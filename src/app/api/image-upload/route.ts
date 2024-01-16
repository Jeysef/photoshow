import { FormFieldNames } from "@/components/pages/edit/formSchema";
import { type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    const options = Object.fromEntries(request.nextUrl.searchParams.entries());
    console.log("🚀 ~ file: route.ts:7 ~ POST ~ options:", options);
    const formData = await request.formData();
    const files = formData.getAll(FormFieldNames.FILES) as (File | null)[];
    const file = files[0];
    if (!file) {
        return Response.json({ success: false });
    }
    console.log("File", file);
    return Response.json({ success: true });
};

export const runtime = "nodejs";
