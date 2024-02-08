import path from "path";
import type EditType from "../configurator/model/Edit";
import type Output from "../configurator/model/Output";
import type { Soundtrack } from "./model/Soundtrack";
import Timeline from "./model/Timeline";
import type { ITracksOutput } from "./model/Tracks";

type Input = { name: string; config?: string[]; format?: string } & (
    | {
          loop: true | number;
          fps: number;
      }
    | {
          loop?: never;
          fps?: never;
      }
);

class Edit {
    public readonly filterComplexFileName = "filterComplex.txt";
    private readonly output: Output;
    private readonly soundtrack: Soundtrack | undefined;
    private readonly tracks: ITracksOutput;

    constructor(private readonly edit: EditType) {
        const { output, soundtrack, tracks } = new Timeline(this.edit).getOutput();
        this.output = output;
        this.soundtrack = soundtrack;
        this.tracks = tracks;
    }

    getImageInputs = (): Input[] => {
        return this.tracks.assets.map((asset) => {
            return {
                name: asset.name,
                format: asset.format,
                loop: true,
                fps: asset.fps ?? this.output.fps,
            } satisfies Input;
        });
    };

    getSoundtrackInput = (): Input | undefined => {
        if (!this.soundtrack) return undefined;
        const input = this.soundtrack.getInput();
        if (!input) return undefined;
        return {
            name: input.name,
            config: input.config,
        } satisfies Input;
    };

    getFilterComplexScript = () => {
        const filterComplexScript = this.tracks.script;
        // return `filter_complex_script=${this.filterComplexFileName}`;
        return ["-filter_complex", filterComplexScript];
    };

    outputName = (): string => {
        return path.join(this.output.destination.src, `${this.output.destination.name}.${this.output.format}`);
    };

    outputOptions = (): string[] => {
        return [
            "-map",
            `${this.tracks.outputStreamLabel}`, // put stream `video` to output
            ...(!this.soundtrack ? [] : ["-map", `${this.soundtrack.label}`, "-shortest"]),
            "-y",
            "-movflags",
            "+faststart",
        ];
    };

    duration = (): number => {
        return this.tracks.duration;
    };

    fps = (): number => {
        return this.output.fps;
    };
}

export default Edit;
