import { FFMpegProgress } from "ffmpeg-progress-wrapper";
import * as fs from "fs";
import path from "path";
import { type IJsonGeneratorProps, JsonGenerator } from "../jsonGenerator/JsonGenerator";
import ScriptGenerator from "../scriptGenerator/Timeline";
import { LoggerEmoji, LoggerState } from "./enums";
import Logger from "./logger";

export interface IShow {
    progress: FFMpegProgress;
    duration: number;
}


export function createShow(props: IJsonGeneratorProps): IShow {
    Logger.log(LoggerState.INFO, LoggerEmoji.WORK, "Creating show");
    const json = JsonGenerator.createJson(props);
    const scriptGenerator = new ScriptGenerator(json);
    const filter = scriptGenerator.returnFilterComplexScript();
    const code = scriptGenerator.returnScript();

    fs.writeFileSync("fullScript.txt", code.join(" "));
    fs.writeFileSync(scriptGenerator.filterComplexFileName, filter);
    Logger.log(LoggerState.INFO, LoggerEmoji.START, "Show started");

    const windows = process.platform === "win32";
    let ffmpegPath;
    if (windows) {
        ffmpegPath = path.resolve(process.cwd(), "ffmpeg.exe");
    } else {
        ffmpegPath = path.resolve(process.cwd(), "ffmpeg");
    }


    const progress = new FFMpegProgress(code, {
        cmd: ffmpegPath,
        duration: scriptGenerator.returnDuration()
    });
    // progress.on("raw", (data) => {
    //     console.log("progress raw: ", data);
    // });
    return { progress, duration: scriptGenerator.returnDuration() };
}