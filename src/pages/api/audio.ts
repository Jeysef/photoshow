import { AUDIO_PATH } from "@/constants";
import { createReadStream } from "fs";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { resolve } from "path";
import { getAudioNames } from "./audioNames";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const audioName = req.query.audioName;
        if (!audioName || (await getAudioNames()).indexOf(audioName as string) === -1) {
            res.status(400).end();
            return;
        }
        const musicsPath = AUDIO_PATH;
        const musicPath = resolve(musicsPath, audioName as string);
        // return music file
        createReadStream(musicPath).pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

export const config = {
    api: {
        responseLimit: false,
    },
};
