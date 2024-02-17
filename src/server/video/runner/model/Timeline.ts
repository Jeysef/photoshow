import Big from "big.js";
import type Edit from "../../configurator/model/Edit";
import type Output from "../../configurator/model/Output";
import { fadeText } from "../../functions";
import type { StreamLabel } from "../../types/types";
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

    private createSoundtrack = (label: StreamLabel): Soundtrack | undefined => {
        if (!this.props.timeline.soundtrack) return undefined;
        return new Soundtrack(label, this.props.timeline.soundtrack);
    };

    private titleScript = () => {
        const title = this.props.timeline.title;
        if (!title) return "";
        const script = fadeText({
            // fontfile: "assets/fonts/biennale_regular.otf",
            fontfile: "assets/fonts/Roboto-Medium.ttf",
            text: title.replace(/ /g, "\u00A0"),
            fontsize: 48,
            fontcolor: "#ffffff",
            x: "(w-text_w)/2",
            y: "(h-text_h)/2",
            fadeInStart: 0,
            fadeInDuration: 1,
            fadeOutStart: 5,
            fadeOutDuration: 1,
        });
        return `format=yuv444p,${script},format=yuv420p`;
    };

    private formatOutputVideo = (prevOutputStreamLabel: string, script: string) => {
        const outputStreamLabel: StreamLabel = "[out]";
        const title = this.titleScript();
        script += `${prevOutputStreamLabel}${title}${outputStreamLabel}`;
        return {
            script: script,
            outputStreamLabel: outputStreamLabel,
        };
    };

    private formatOutputAudio = (tracks: ITracksOutput) => {
        const inLabel: StreamLabel = `[${tracks.clipsCount}:a]`;
        if (!this.props.timeline.soundtrack || (!this.props.timeline.soundtrack.fadeInDuration && !this.props.timeline.soundtrack.fadeOutDuration))
            return {
                script: undefined,
                outputStreamLabel: inLabel,
            };
        const { fadeInDuration, fadeOutDuration } = this.props.timeline.soundtrack;
        /**
         * the audio label is the last label in the script and because input labels are 0 based, the label of the audio is the number of clips
         */
        const outLabel: StreamLabel = "[outa]";
        const fadeInScript = fadeInDuration ? `afade=in:0:d=${fadeInDuration}` : "";
        const fadeOutScript = fadeOutDuration ? `afade=out:st=${tracks.duration.sub(fadeOutDuration).round(Big.DP).toNumber()}:d=${fadeOutDuration}` : "";
        return {
            script: `${inLabel}${fadeInScript},${fadeOutScript}${outLabel}`,
            outputStreamLabel: outLabel,
        };
    };

    public getOutput(): ITimelineOutput {
        const tracks = this.createTracks().getOutput();
        const formatOutputVideo = this.formatOutputVideo(tracks.outputStreamLabel, tracks.script);
        const formatOutputAudio = this.formatOutputAudio(tracks);
        const soundtrack = this.createSoundtrack(formatOutputAudio.outputStreamLabel);
        tracks.script = formatOutputAudio.script ? formatOutputVideo.script + ";" + formatOutputAudio.script : formatOutputVideo.script;
        tracks.outputStreamLabel = formatOutputVideo.outputStreamLabel;
        return {
            tracks: tracks,
            output: this.props.output,
            soundtrack: soundtrack,
        };
    }
}

export default Timeline;
