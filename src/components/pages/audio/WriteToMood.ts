"use server";
import { env } from "@/env";
import type { IMood } from "@/types/types";
import fs from "fs-extra";
import path from "path";

export async function writeToJsonFile(mood: IMood) {
    const jsonPath = path.resolve(process.cwd(), env.NEXT_PUBLIC_MOODS_FILE);
    const createJson = async (existingJson: IMood[]) => {
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
        // void writeJsonFile(jsonPath, newJson);
        await fs.writeJSON(jsonPath, newJson, { spaces: 2 });
    };
    try {
        // const existingJson = await loadJsonFile<IMood[] | undefined>(jsonPath);
        const existingJson = (await fs.readJSON(jsonPath, { throws: true })) as IMood[];
        if (existingJson) void createJson(existingJson);
    } catch (error) {
        void createJson([]);
    }
}
