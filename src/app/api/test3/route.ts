import { StreamingTextResponse } from "ai";
import { EventEmitter } from "stream";
export async function GET() {
    let count = 0;
    const eventEmitter = new EventEmitter();

    // Create a readable stream
    const readableStream = new ReadableStream({
        start(controller) {
            eventEmitter.on("data", (data) => {
                controller.enqueue(data);
            });
            eventEmitter.on("end", () => {
                controller.close();
            });
        },
    });

    // Listen for the 'data' event and push the data to the readable stream

    // Emit data every 4 seconds
    eventEmitter.emit("data", `data_${-1}\n`);
    const interval = setInterval(() => {
        const data = `data_${count}\n`;
        eventEmitter.emit("data", data);
        count++;
        if (count === 4) {
            clearInterval(interval);
            eventEmitter.emit("end");
        }
    }, 2000);

    return new StreamingTextResponse(readableStream);
}
