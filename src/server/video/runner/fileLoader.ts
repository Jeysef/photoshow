import { FormFieldNames } from "@/components/pages/edit/formSchema";
import type { FullVideoId } from "@/types/types";
import fs from "fs-extra";
import path from "path";
import logger from "../logger";
import { LoggerEmoji, LoggerState } from "../logger/enums";
import { getDestinationPath } from "./destinationPath";

export default async function saveImages(props: { formData: FormData; videoId: FullVideoId }): Promise<{ imagePaths: string[] }> {
    const { formData, videoId } = props;
    const destination = getDestinationPath(videoId);

    if (await folderExistsAsync(destination)) {
        logger.log(LoggerState.INFO, LoggerEmoji.ERROR, "Directory for trip already exists. Cleaning up...");
        await deleteVideoFolder(videoId);
    }

    logger.log(LoggerState.DEBUG, LoggerEmoji.DEBUG, "Creating directory for trip");
    createVideoFolder(videoId);
    const { images: imagePaths } = await writeImages(getFilesFromFormData(formData), destination);
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

        await fs.writeFile(imagePath, Buffer.from(await file.arrayBuffer()));

        return imagePath;
    } catch (error) {
        console.error("Error saving image:", error);
        throw error;
    }
}

export async function deleteVideoFolder(videoId: FullVideoId) {
    const destination = getDestinationPath(videoId);
    if (await folderExistsAsync(destination)) {
        await fs.rm(destination, { recursive: true });
    }
}

export function deleteImagesFromFolder(videoId: FullVideoId) {
    console.log("Deleting images from folder: ", videoId);
    const destination = getDestinationPath(videoId);
    const videoExtension = ".mp4";
    if (folderExists(destination)) {
        fs.readdirSync(destination)
            .filter((file) => !file.endsWith(videoExtension))
            .map((file) => fs.unlinkSync(path.join(destination, file)));
    }
}
export function folderExists(destination: string): boolean {
    return fs.pathExistsSync(destination);
}
export function folderExistsAsync(destination: string): Promise<boolean> {
    return fs.pathExists(destination);
}

export function createVideoFolder(videoId: FullVideoId): void {
    const destination = getDestinationPath(videoId);
    if (!folderExists(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }
}

export function getImagesFromFolder(destination: string): string[] {
    if (folderExists(destination)) {
        return fs.readdirSync(destination).filter((file) => !file.endsWith(".mp4"));
    }
    return [];
}

export function getVideoFile(videoPath: string, videoName: string): File {
    const existVideoFile = fs.existsSync(videoPath);
    if (existVideoFile) {
        const buffer = fs.readFileSync(videoPath);
        return new File([buffer], videoName);
    }
    throw new Error("Video file does not exist");
}
