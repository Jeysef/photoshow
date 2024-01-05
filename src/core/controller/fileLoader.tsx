import { FormFieldNames } from "@/components/pages/edit/formSchema";
import * as fs from "fs";
import path from "path";
import { type ISubmitProps, type VideoId } from "../../types/types";
import { LoggerEmoji, LoggerState } from "./enums";
import Logger from "./logger";
import { DIRS_PATH } from "@/constants";

export default async function imagesLoader(props: ISubmitProps & { destination: string }): Promise<{ imagePaths: string[] }> {
    const { formData, destination } = props;

    if (fs.existsSync(destination)) {
        Logger.log(LoggerState.INFO, LoggerEmoji.ERROR, "Directory for trip already exists");
    }

    Logger.log(LoggerState.INFO, LoggerEmoji.SUCCESS, "Creating directory for trip");
    fs.mkdirSync(destination, { recursive: true });
    const { images: imagePaths } = await saveImages(formData, destination);
    return { imagePaths };
}

async function saveImages(formData: FormData, directory: string): Promise<{ images: string[] }> {
    const images: string[] = [];

    for (const image of formData.getAll(FormFieldNames.FILES)) {
        if (image === undefined || (image as File).name === "undefined") continue;
        const imagePath = await saveImage(image as File, directory);
        images.push(imagePath);
    }

    return { images };
}

async function saveImage(file: File, directory: string): Promise<string> {
    try {
        if (typeof directory !== "string") {
            throw new Error("Invalid directory");
        } else if (!file.size) {
            throw new Error("Invalid file");
        }
        const imagePath = path.join(directory, file.name);

        fs.writeFileSync(imagePath, Buffer.from(await file.arrayBuffer()));

        return imagePath;
    } catch (error) {
        console.error("Error saving image:", error);
        throw error;
    }
}

export function deleteVideoFolder(videoId: VideoId) {
    console.log("Deleting video folder: ", videoId);
    const destination = path.resolve(process.cwd(), DIRS_PATH, videoId);
    if (fs.existsSync(destination)) {
        fs.rm(destination, { recursive: true }, (err) => {
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
    const destination = path.resolve(process.cwd(), DIRS_PATH, videoId);
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
