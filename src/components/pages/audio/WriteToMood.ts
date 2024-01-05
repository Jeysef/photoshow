"use server";
import { loadJsonFile } from "load-json-file";
import { writeJsonFile } from "write-json-file";
import { type IMood } from "./types";
import path from "path";
import { MOOD_PATH } from "@/constants";

export async function writeToJsonFile(mood: IMood) {
    const createJson = async (existingJson: IMood[]) => {
        if (MOOD_PATH) {
            // if existingJson has item with name same as mood.name, then replace it
            const exists = existingJson.find((item) => item.name === mood.name);
            let newJson: IMood[];
            if (exists) {
                newJson = existingJson.map((item) => {
                    if (item.name === mood.name) {
                        return mood;
                    } else {
                        return item;
                    }
                });
            } else {
                newJson = [...existingJson, mood];
            }
            void writeJsonFile(MOOD_PATH, newJson);
        } else {
            throw new Error("No mood path defined");
        }
    };
    if (MOOD_PATH) {
        try {
            const existingJson = await loadJsonFile<IMood[] | undefined>(path.resolve(process.cwd(), MOOD_PATH));
            if (existingJson) void createJson(existingJson);
        } catch (error) {
            void createJson([]);
        }
    } else {
        console.log("No mood path defined");
    }
}
