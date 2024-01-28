import { EventEmitter } from "events";
import type { NextApiRequest, NextApiResponse } from "next";

export default function GET(request: NextApiRequest, response: NextApiResponse) {
    const emitter = new EventEmitter();
    let count = 0;

    response.useChunkedEncodingByDefault = true;
    // Set the 'Transfer-Encoding: chunked' header
    response.setHeader("Transfer-Encoding", "chunked");
    response.setHeader("Content-Type", "text/event-stream");
    response.flushHeaders();
    response.uncork();

    emitter.on("text", (text: string) => {
        response.write(text);
        count++;

        if (count === 4) {
            response.end();
        }
    });
    setInterval(() => {
        emitter.emit("text", "Hello, world!\n");
    }, 4000);
}
