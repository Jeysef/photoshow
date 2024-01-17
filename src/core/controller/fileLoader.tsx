import { FormFieldNames } from "@/components/pages/edit/formSchema";
import * as fs from "fs";
import path from "path";
import { type VideoId } from "../../types/types";
import { getDestinationPath } from "../helpers";
import { LoggerEmoji, LoggerState } from "./enums";
import Logger from "./logger";

export default async function saveImages(props: { formData: FormData; videoId: VideoId }): Promise<{ imagePaths: string[] }> {
    const { formData, videoId } = props;
    const destination = getDestinationPath(videoId);

    if (fs.existsSync(destination)) {
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

async function writeImages(files: File[], directory: string): Promise<{ images: string[] }> {
    const imagePaths = await Promise.all(files.map((file) => writeFile(file, directory)));

    return { images: imagePaths };
}

async function writeFile(file: File, directory: string): Promise<string> {
    try {
        if (typeof directory !== "string") {
            throw new Error("Invalid directory");
        } else if (!file.size) {
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
    console.log("Deleting video folder: ", videoId);
    const destination = getDestinationPath(videoId);
    if (fs.existsSync(destination)) {
        fs.rm(destination, {}, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Deleted video folder: ", destination, "successfully");
            }
        });
    }
}

export function deleteImagesFromFolder(videoId: VideoId) {
    console.log("Deleting images from folder: ", videoId);
    const destination = getDestinationPath(videoId);
    if (fs.existsSync(destination)) {
        fs.readdir(destination, (err, files) => {
            if (err) {
                console.error(err);
            } else {
                for (const file of files) {
                    if (file.endsWith(".jpg")) {
                        fs.unlink(path.join(destination, file), (err) => {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log("Deleted image: ", file, "successfully");
                            }
                        });
                    }
                }
            }
        });
    }
}

function createVideoFolder(videoId: VideoId) {
    const destination = getDestinationPath(videoId);
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }
}
