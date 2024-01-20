import { FormFieldNames } from "@/components/pages/edit/formSchema";
import { getDestinationPath } from "@/core/helpers";
import * as fs from "fs";
import path from "path";
import { type VideoId } from "../../types/types";
import { LoggerEmoji, LoggerState } from "./enums";
import Logger from "./logger";

export default async function saveImages(props: { formData: FormData; videoId: VideoId }): Promise<{ imagePaths: string[] }> {
    const { formData, videoId } = props;
    const destination = getDestinationPath(videoId);

    if (folderExists(destination)) {
        Logger.log(LoggerState.INFO, LoggerEmoji.ERROR, "Directory for trip already exists. Cleaning up...");
        deleteVideoFolder(videoId);
    }

    Logger.log(LoggerState.INFO, LoggerEmoji.SUCCESS, "Creating directory for trip");
    createVideoFolder(videoId);
    const { images: imagePaths } = await writeImages(getFilesFromFormData(formData), destination);
    console.log("imagePaths", imagePaths);
    return { imagePaths };
}

function getFilesFromFormData(formData: FormData): File[] {
    const files: File[] = [];
    for (const value of formData.getAll(FormFieldNames.FILES)) {
        files.push(value as File);
    }
    return files;
}

export async function writeImages(files: File[], directory: string): Promise<{ images: string[] }> {
    const imagePaths = await Promise.all(files.map((file) => writeFile(file, directory)));

    return { images: imagePaths };
}

export async function writeFile(file: File, directory: string): Promise<string> {
    try {
        if (!file.size) {
            throw new Error("Invalid file");
        }
        const imagePath = path.join(directory, file.name);

        await fs.promises.writeFile(imagePath, Buffer.from(await file.arrayBuffer()));

        return imagePath;
    } catch (error) {
        console.error("Error saving image:", error);
        throw error;
    }
}

export function deleteVideoFolder(videoId: VideoId) {
    const destination = getDestinationPath(videoId);
    if (folderExists(destination)) {
        fs.rmdirSync(destination, { recursive: true });
    }
}

export function deleteImagesFromFolder(videoId: VideoId) {
    console.log("Deleting images from folder: ", videoId);
    const destination = getDestinationPath(videoId);
    const fileExtension = ".jpg";
    if (folderExists(destination)) {
        fs.readdirSync(destination)
            .filter((file) => file.endsWith(fileExtension))
            .map((file) => fs.unlinkSync(path.join(destination, file)));
    }
}
export function folderExists(destination: string): boolean {
    return fs.existsSync(destination);
}

export function createVideoFolder(videoId: VideoId): void {
    const destination = getDestinationPath(videoId);
    if (!folderExists(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }
}

export function getImagesFromFolder(destination: VideoId): string[] {
    if (folderExists(destination)) {
        return fs.readdirSync(destination).filter((file) => file.endsWith(".jpg"));
    }
    return [];
}
