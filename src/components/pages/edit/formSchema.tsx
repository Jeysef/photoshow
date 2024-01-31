import { OutputResolution } from "@/server/video/types/enums";
import { OrientationType } from "@/types/types";
import z from "zod";

enum FormFieldNames {
    SOUNDTRACK = "soundtrack",
    RESOLUTION = "resolution",
    ORIENTATION = "orientation",
    FILES = "files",
    TITLE = "title",
}

const formSchema = z.object({
    [FormFieldNames.SOUNDTRACK]: z.optional(z.string()),
    [FormFieldNames.RESOLUTION]: z.optional(z.nativeEnum(OutputResolution)),
    [FormFieldNames.ORIENTATION]: z.optional(z.nativeEnum(OrientationType)),
    [FormFieldNames.TITLE]: z.optional(z.string()),
    [FormFieldNames.FILES]: z.optional(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

export { FormFieldNames, formSchema, type FormValues };
