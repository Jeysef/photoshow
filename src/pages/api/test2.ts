import type { NextApiRequest, NextApiResponse } from "next";

function iteratorToStream(iterator: AsyncGenerator<Uint8Array, void, unknown>) {
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await iterator.next();

            if (done) {
                controller.close();
            } else {
                controller.enqueue(value);
            }
        },
    });
}

function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

const encoder = new TextEncoder();

async function* makeIterator() {
    yield encoder.encode("<p>One</p>");
    await sleep(2000);
    yield encoder.encode("<p>Two</p>");
    await sleep(2000);
    yield encoder.encode("<p>Three</p>");
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const iterator = makeIterator();
    const stream = iteratorToStream(iterator);
    // pipe the stream to the stdout
    // const vv = await stream.getReader().read();
    // console.log("🚀 ~ file: route.ts:36 ~ GET ~ vv:", vv);
    // res
    // stream.pipeTo(res);
    return new Response(stream);
}

export const config = {
    runtime: "edge",
};
