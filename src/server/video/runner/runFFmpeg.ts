import { env } from "@/env";
import type { VideoId } from "@/types/types";
import { ShowStreamType, type IShowStreamData } from "@/types/types";
import ffmpeg from "fluent-ffmpeg";
import { platform } from "os";
import path from "path";
import logger from "../logger";
import { LoggerEmoji, LoggerState } from "../logger/enums";
import type { UploadData } from "../types/types";
import type Edit from "./Edit";

export function runFFmpeg(data: Edit, videoId: VideoId, onDone: (videoDestination: string, videoId: VideoId) => Promise<UploadData>, onClear: () => void) {
    let ffmpegPath = "ffmpeg";
    if (platform() === "win32") {
        ffmpegPath = path.join(process.cwd(), "ffmpeg.exe");
    } else {
        ffmpegPath = path.join(process.cwd(), "ffmpeg");
    }
    const timeout = 10 * 60; // 10 minutes

    let startTime = 0;
    if (env.NODE_ENV === "development") {
        startTime = Date.now();
    }

    const duration = data.duration();
    const fps = data.fps();

    let cancelled = false;

    const progressStream = new ReadableStream<IShowStreamData>({
        start: (controller) => {
            controller.enqueue({
                type: ShowStreamType.VIDEO_RENDERING,
            });

            const command = ffmpeg({ niceness: -10, timeout: timeout, cwd: process.cwd() }).setFfmpegPath(ffmpegPath);

            const checkCancelled = () => {
                if (cancelled) {
                    command.kill("SIGKILL");
                    controller.error(new Error("Cancelled"));
                    onClear();
                    return true;
                }
                return false;
            };
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
                    checkCancelled();
                    if (env.NODE_ENV === "development") {
                        logger.log(LoggerState.DEBUG, LoggerEmoji.DEBUG, "Spawned Ffmpeg with command: " + commandLine);
                        startTime = Date.now();
                    }
                })
                .on("progress", ({ frames }: { frames: number }) => {
                    checkCancelled();

                    const percent = Math.round((100 * frames) / (duration * fps));
                    logger.log(LoggerState.DEBUG, LoggerEmoji.DEBUG, "Processing: " + percent + "%");

                    // Push progress data into the stream
                    controller.enqueue({
                        type: ShowStreamType.PROGRESS,
                        progress: percent,
                    });
                })
                .on("end", () => {
                    checkCancelled();
                    if (env.NODE_ENV === "development") {
                        const endTime = Date.now();
                        const duration = endTime - startTime;
                        logger.log(LoggerState.DEBUG, LoggerEmoji.DEBUG, `Execution time: ${duration} ms`);
                    }
                    logger.log(LoggerState.DEBUG, LoggerEmoji.DEBUG, "Output file is: " + data.outputName());

                    controller.enqueue({
                        type: ShowStreamType.PROGRESS,
                        progress: 100,
                    });

                    onDone(data.outputName(), videoId)
                        .then((uploadData) => {
                            checkCancelled();
                            controller.enqueue({
                                type: ShowStreamType.VIDEO_URL,
                                ...uploadData,
                            });
                            onClear();
                            controller.close();
                        })
                        .catch((err) => {
                            console.error(err);
                            controller.error(err);
                        });
                })
                .on("error", (err) => {
                    logger.log(LoggerState.ERROR, LoggerEmoji.ERROR, "An error occurred: " + err);
                    controller.error(err);
                })
                .on("codecData", function (data: { audio: string; video: string }) {
                    logger.log(LoggerState.DEBUG, LoggerEmoji.DEBUG, "Input is " + data.audio + " audio " + "with " + data.video + " video");
                })
                .run();
        },
        cancel: (data) => {
            console.log("🚀 ~ file: runFfmpeg.ts:100 ~ cancel ~ data:", data);
            cancelled = true;
        },
    });
    return progressStream;
}
