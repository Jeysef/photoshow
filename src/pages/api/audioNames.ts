import moodsFile from "@/../moods/moods.json";
import { env } from "@/env";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next/types";
import path from "path";

/**
 * This route handler could be used in app directory, but I left it here for uniformity.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const moods = moodsFile;
        res.status(200).json(moods.map((mood) => mood.name));
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

export function getAudioNames() {
    return fs.promises.readdir(path.resolve(process.cwd(), env.NEXT_PUBLIC_MOODS_FILE));
}
