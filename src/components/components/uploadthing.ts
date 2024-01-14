import type { UploadRouter } from "@/server/uploadthing";
import { generateComponents } from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react/hooks";

export const { UploadButton, UploadDropzone, Uploader } = generateComponents<UploadRouter>();

export const { useUploadThing, uploadFiles } = generateReactHelpers<UploadRouter>();
