import { currentUser } from "@clerk/nextjs/server";
import type { FileRouterInputConfig } from "@uploadthing/shared";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing({
    /**
     * Log out more information about the error, but don't return it to the client
     * @see https://docs.uploadthing.com/errors#error-formatting
     */
    errorFormatter: (err) => {
        console.log("Error uploading file", err.message);
        console.log("  - Above error caused by:", err.cause);

        return { message: err.message };
    },
});

const inputSchema = z.object({
    config: z.object({
        current: z.object({
            soundtrack: z.string().optional(),
            resolution: z.string().optional(),
            orientation: z.string().optional(),
            title: z.string().optional(),
        }),
    }),
});

const inputConfig: FileRouterInputConfig = {
    image: { maxFileSize: "8MB", maxFileCount: 4 },
};

// FileRouter for your app, can contain multiple FileRoutes
const uploadRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f(inputConfig)
        .input(inputSchema)
        // Set permissions and file types for this FileRoute
        .middleware(async ({ input }) => {
            console.log("🚀 ~ .middleware ~ input:", input);
            // This code runs on your server before upload
            const userId = (await currentUser())?.id;

            // If you throw, the user will not be able to upload
            if (!userId) throw new Error("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);

            console.log("file url", file.url);

            // !!! Whatever is returned here is sent to the client side `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId, url: file.url };
        }),
} satisfies FileRouter;

type UploadRouter = typeof uploadRouter;

const utapi = new UTApi();

export { uploadRouter, utapi, type UploadRouter };
