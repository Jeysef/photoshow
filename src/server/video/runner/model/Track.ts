import type Output from "../../configurator/model/Output";
import type TrackRenderer from "../../configurator/model/Track";
import { getLabelName, overlay } from "../../functions";
import Clips, { type IClipsOutput } from "./Clips";

export interface ITrackProps {
    track: TrackRenderer;
    index: number;
    background: string;
    output: Output;
    prevTrack?: Track;
}

export type ITrackOutput = IClipsOutput;

class Track {
    public _clips: Clips | undefined;
    private _clipsOutput: IClipsOutput | undefined;
    constructor(private readonly props: ITrackProps) {}

    private createClips = (): Clips => {
        return new Clips({
            clips: this.props.track.clips,
            index: this.props.index,
            output: this.props.output,
            background: this.props.background,
            prevClips: this.props.prevTrack?.clips,
        });
    };

    private get clips(): Clips {
        if (this._clips) return this._clips;
        return (this._clips = this.createClips());
    }
    private get clipsOutput(): IClipsOutput {
        if (this._clipsOutput) return this._clipsOutput;
        return (this._clipsOutput = this.clips.getOutput());
    }

    public overlayBy = (track: Track) => {
        const outputStreamLabel = `[${getLabelName(this.clipsOutput.outputStreamLabel)}_overlaidBy_${getLabelName(track.clipsOutput.outputStreamLabel)}]`;
        return overlay({
            mainStream: this.clipsOutput.outputStreamLabel,
            overlayStream: track.clipsOutput.outputStreamLabel,
            outputStreamLabel: outputStreamLabel,
        });
    };

    private removeLastIfSemicolon = (script: string) => {
        if (script.endsWith(";")) {
            script = script.slice(0, -1);
        }
        return script;
    };

    public getOutput = (): ITrackOutput => {
        let script = this.clipsOutput.script;
        script = this.removeLastIfSemicolon(script);
        return {
            assets: this.clipsOutput.assets,
            script: script,
            outputStreamLabel: this.clipsOutput.outputStreamLabel,
            clipsCount: this.clipsOutput.clipsCount,
            duration: this.clipsOutput.duration,
        };
    };
}

export default Track;
