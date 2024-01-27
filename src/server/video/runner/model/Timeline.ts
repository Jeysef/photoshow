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

    public getOutput(): ITimelineOutput {
        return {
            tracks: this.createTracks().getOutput(),
            output: this.props.output,
            soundtrack: this.createSoundtrack(),
        };
    }
}

export default Timeline;
