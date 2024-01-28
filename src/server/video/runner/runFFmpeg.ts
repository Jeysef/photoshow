import ffmpeg from "fluent-ffmpeg";
import type Edit from "./Edit";

export interface IShow {
    meta: {
        duration: number;
        fps: number;
    };
}

export function runFFmpeg(data: Edit) {
    const ffmpegPath = "ffmpeg";
    const timeout = 10 * 60; // 10 minutes

    let startTime = Date.now();

    const duration = data.duration();
    const fps = data.fps();

    // Create a custom PassThrough stream to push progress data into
    // const progressStream = new PassThrough({ objectMode: true });
    // Create a Readable stream to push progress data into
    // const progressStream = new Readable({
    //     read() {
    //         undefined;
    //     },
    // });
    const progressStream = new ReadableStream<string>({
        start(controller) {
            const command = ffmpeg({ niceness: -10, timeout: timeout, cwd: process.cwd() }).setFfmpegPath(ffmpegPath);

            data.getImageInputs().forEach(({ name, config, format, fps, loop }) => {
                command.input(name);
                if (loop === true) command.loop();
                else if (loop) command.loop(loop);
                if (fps) command.withInputFPS(fps);
                if (config) command.inputOptions(config);
                if (format) command.inputFormat(format);
            });
            const soundtrackInput = data.getSoundtrackInput();
            if (soundtrackInput) {
                command.input(soundtrackInput.name);
                if (soundtrackInput.config) command.inputOptions(soundtrackInput.config);
            }

            command.addOutputOption(data.getFilterComplexScript());
            command.addOutputOptions(data.outputOptions());
            command.output(data.outputName());
            command
                .on("start", (commandLine) => {
                    console.log("Spawned Ffmpeg with command: " + commandLine);
                    startTime = Date.now();
                })
                .on(
                    "progress",
                    (progress: {
                        frames: number;
                        currentFps: number;
                        currentKbps: number;
                        targetSize: number;
                        timemark: unknown;
                        percent: number | undefined;
                    }) => {
                        const frames = progress.frames;
                        const percent = Math.round((100 * frames) / (duration * fps));
                        const renderedDuration = (percent / 100) * duration;
                        console.log("Processing: " + percent + "%");

                        // Push progress data into the stream
                        controller.enqueue(percent.toString());
                    },
                )
                .on("end", () => {
                    const endTime = Date.now();
                    const duration = endTime - startTime;
                    console.log("Processing: 100%");
                    console.log("Execution time:", duration, "ms");
                    console.log("Output file is: " + data.outputName());
                    controller.enqueue("100");
                    controller.close();
                })
                .on("error", (err) => {
                    console.log("An error occurred: " + err);
                    controller.error(err);
                })
                .on("codecData", function (data: { audio: string; video: string }) {
                    console.log("Input is " + data.audio + " audio " + "with " + data.video + " video");
                })
                .run();
        },
    });
    return progressStream;
}
