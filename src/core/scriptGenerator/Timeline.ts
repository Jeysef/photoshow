import type Edit from "../jsonGenerator/model/Edit";
import Tracks, { type ITracksOutput } from "./Tracks";
import { Soundtrack } from "./model/Soundtrack";

class ScriptGenerator {
    private readonly json: Edit;
    public readonly filterComplexFileName = "filterComplex.txt";
    private readonly defaultBackground = "#000000";
    private _soundtrack: Soundtrack | undefined;
    private _tracksOutput: ITracksOutput | undefined;

    constructor(edit: Edit) {
        this.json = edit;
    }

    private createTracks = (): Tracks => {
        return new Tracks({
            tracks: this.json.timeline.tracks,
            background: this.json.timeline.background ?? this.defaultBackground,
            output: this.json.output,
        });
    };

    private get tracksOutput(): ITracksOutput {
        if (this._tracksOutput) return this._tracksOutput;
        return (this._tracksOutput = this.createTracks().getOutput());
    }
    private get soundtrack(): Soundtrack | undefined {
        if (!this.json.timeline.soundtrack) return undefined;
        if (this._soundtrack) return this._soundtrack;
        return (this._soundtrack = new Soundtrack(this.json.timeline.soundtrack));
    }

    private getInputs = (): string[] => {
        return [...this.tracksOutput.assets, ...(!this.soundtrack ? [] : this.soundtrack.getInput())];
    };

    private getEndScript = (): string[] => {
        const mapSoundtrack = this.soundtrack ? ["-map", `${this.tracksOutput.clipsCount}:a`] : [];
        return [
            "-map",
            `${this.tracksOutput.outputStreamLabel}`, // put stream `video` to output
            ...mapSoundtrack,
            "-c:v",
            "libx264",
            "-preset",
            "veryfast", // video codec - x264
            // "-g",
            // "30",
            // "-lag-in-frames",
            // "25",
            // "-deadline",
            // "good",
            // "-cpu-used",
            // "0",
            // "-crf",
            // "22",
            // "-tune",
            // "animation",
            // "-qmin",
            // "11",
            // "-qmax",
            // "51",
            // "-slices",
            // "4",
            "-b",
            "2M",
            // "-b:","128k",                           // setbitrate, default 200k
            "-c:a",
            "copy", // do not re-encode audio
            // "-loglevel","debug",                    // log level
            "-r",
            `${this.json.output.fps}`, // set fps
            "-t", // set specific output video duration
            `${this.tracksOutput.duration}`, // set specific output video duration
            // `out/output${new Date().getTime()}.mp4` // set output path (directory & filename)
            `${this.json.output.destination.src}/${this.json.output.destination.name}.mp4`, // set output path (directory & filename)
        ];
    };

    public returnScript = (): string[] => {
        return [
            "-y", // rewrite output file without asking
            ...this.getInputs(),
            "-filter_complex_script",
            this.filterComplexFileName,
            ...this.getEndScript(),
        ];
    };

    public returnFilterComplexScript = (): string => {
        return this.tracksOutput.script;
    };
    public returnDuration = (): number => {
        return this.tracksOutput.duration;
    };
}

export default ScriptGenerator;
