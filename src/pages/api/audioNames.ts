import moodsFile from "@/../moods/moods.json";
import { type IMood } from "@/components/pages/audio/types";
import { AUDIO_PATH } from "@/constants";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next/types";
import path from "path";

/**
 * This route handler could be used in app directory, but I left it here for uniformity.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const moods = moodsFile as IMood[];
        res.status(200).json(moods.map((mood) => mood.name));
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

export function getAudioNames() {
    return fs.promises.readdir(path.resolve(process.cwd(), AUDIO_PATH ?? ""));
}
