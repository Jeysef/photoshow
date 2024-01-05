import { createReadStream, promises as fsPromises } from "fs";
import { type NextApiRequest, type NextApiResponse } from "next";
import { join } from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const videoId = req.query.videoId;
        if (!videoId) {
            res.status(400).end();
            return;
        }
        const videoPath = join(process.cwd(), "dirs", videoId as string, "video.mp4");
        const stat = await fsPromises.stat(videoPath);
        const { size } = stat;
        if (!size) {
            res.status(404).end();
            return;
        }
        const range = req.headers.range ?? "";
        const start = Number(range.replace(/\D/g, ""));
        const end = size - 1;
        const chunkSize = end - start + 1;

        const headers = {
            "Content-Range": `bytes ${start}-${end}/${size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4",
        };

        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.writeHead(206, headers);
        createReadStream(videoPath, { start, end }).pipe(res);
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

// example: http://localhost:3001/api/video?videoId=534002
