import { StreamingTextResponse } from "ai";
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
    await sleep(1000);
    yield encoder.encode("<p>Two</p>");
    await sleep(1000);
    yield encoder.encode("<p>Three</p>");
}

export async function GET(req: Request) {
    // Extract the `messages` from the body of the request

    const iterator = makeIterator();
    const stream = iteratorToStream(iterator);
    // pipe the stream to the stdout

    return new StreamingTextResponse(stream);
}

// export const dynamic = "force-dynamic";
// export const runtime = "edge";
