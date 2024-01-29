import type Edit from "../../configurator/model/Edit";
import type Output from "../../configurator/model/Output";
import { Soundtrack } from "./Soundtrack";
import type { ITracksOutput } from "./Tracks";
import Tracks from "./Tracks";

export interface ITimelineOutput {
    tracks: ITracksOutput;
    output: Output;
    soundtrack: Soundtrack | undefined;
}

class Timeline {
    private readonly defaultBackground = "#000000";
    constructor(private props: Edit) {}

    private createTracks = (): Tracks => {
        return new Tracks({
            tracks: this.props.timeline.tracks,
            background: this.props.timeline.background ?? this.defaultBackground,
            output: this.props.output,
        });
    };

    private createSoundtrack = (): Soundtrack | undefined => {
        if (!this.props.timeline.soundtrack) return undefined;
        return new Soundtrack(this.props.timeline.soundtrack);
    };

    private formatOutputVideo = (prevOutputStreamLabel: string, script: string) => {
        const outputStreamLabel = "[out]";
        script += `${prevOutputStreamLabel}format=pix_fmts=yuv420p[out]`;
        return {
            script: script,
            outputStreamLabel: outputStreamLabel,
        };
    };

    public getOutput(): ITimelineOutput {
        const tracks = this.createTracks().getOutput();
        const formatOutputVideo = this.formatOutputVideo(tracks.outputStreamLabel, tracks.script);
        tracks.script = formatOutputVideo.script;
        tracks.outputStreamLabel = formatOutputVideo.outputStreamLabel;
        return {
            tracks: tracks,
            output: this.props.output,
            soundtrack: this.createSoundtrack(),
        };
    }
}

export default Timeline;
