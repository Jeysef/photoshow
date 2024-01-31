import { roundedSub, roundedSum } from "../../../../utils/utils";
import type RendererClip from "../../configurator/model/Clip";
import type Output from "../../configurator/model/Output";
import { getScriptForXFade } from "../../functions";
import { type XFadeTransition } from "../../types/enums";
import type { AssetInput } from "./Asset";
import Clip from "./Clip";

export interface IClipsProps {
    clips: RendererClip[];
    index: number;
    output: Output;
    background?: string;
    prevClips?: Clips;
}

export interface IClipsOutput {
    assets: AssetInput[];
    script: string;
    outputStreamLabel: string;
    duration: number;
    clipsCount: number;
}

class Clips {
    private _clips: Clip[] | undefined;

    constructor(private readonly props: IClipsProps) {}

    private get clips(): Clip[] {
        if (this._clips) return this._clips;
        return (this._clips = this.createClips());
    }

    private createClips = () => {
        const props = this.props;
        const indexAdder = props.prevClips ? props.prevClips.clips.length : 0;

        return props.clips.map((clip, index) => {
            return new Clip({
                clip,
                index: index + indexAdder,
                output: props.output,
                background: props.background,
            });
        });
    };

    private concatenate = () => {
        const firstClip = this.clips[0];
        const lastClip = this.clips.at(-1);
        if (!firstClip) throw new Error("firstClip is undefined");
        if (!lastClip) throw new Error("lastClip is undefined");

        /**
         * starting on on index 1
         */
        const { script, clipLabel, offset } = this.clips.slice(undefined, -1).reduce(
            (acc, clip, index) => {
                const currentClip = clip;
                const nextClip = this.clips[index + 1];

                if (clip.transition && clip.duration < 0.5) {
                    throw new Error(
                        "Clip length is less than 0.5 seconds, Which is needed for the crossfade to work. Clip: " + clip.label + " Length: " + clip.duration,
                    );
                }

                if (!nextClip) {
                    throw new Error("nextClip is undefined");
                }

                const outputStreamLabel = `[stream_C${index}_with_C${index + 1}]`;
                const transitionDuration = 0.5;

                let transition: XFadeTransition | undefined;
                if (currentClip.transition?.out === undefined && nextClip.transition?.in === undefined) {
                    transition = undefined;
                } else if (currentClip.transition?.out === nextClip.transition?.in) {
                    transition = currentClip.transition?.out;
                } else {
                    transition = currentClip.transition?.out;
                    // throw new Error(`Transition in and out do not match on index: ${index}`);
                }

                /**
                 * input	input duration	+	previous xfade offset	-	xfade duration	offset =
                   v0.mp4	    4	        +	    0	                -	    1	           3
                   v1.mp4	    8	        +	    3	                -	    1	           10
                   v2.mp4	    12	        +	    10	                -	    1	           21
                   v3.mp4	    5	        +	    21	                -	    1	           25
                 */
                let offset;
                let script: string;
                if (transition === undefined) {
                    offset = roundedSum(undefined, clip.duration, acc.offset);
                    script = acc.clipLabel + nextClip.label + "concat=n=2" + outputStreamLabel;
                } else {
                    offset = roundedSub(undefined, roundedSum(undefined, clip.duration, acc.offset), transitionDuration);
                    script = acc.clipLabel + nextClip.label + getScriptForXFade(transition, transitionDuration, offset) + outputStreamLabel;
                }

                return {
                    script: acc.script + (acc.script ? ";" : "") + script,
                    clipLabel: outputStreamLabel,
                    offset: offset,
                };
            },
            { script: "", clipLabel: firstClip.label, offset: 0 },
        );
        /**
         * because I am slicing one clip before the end, I need to add the duration of the last clip
         */
        const duration = offset + lastClip.duration;

        return { script, clipLabel, duration };
    };

    public getOutput = (): IClipsOutput => {
        const clips = this.clips;
        const scripts = clips.map((clip) => clip.getScript()); // must be called before concatenate
        const { script, clipLabel, duration } = this.concatenate();
        return {
            assets: clips.map((clip) => clip.asset.getInput()),
            script: scripts.join("") + script,
            outputStreamLabel: clipLabel,
            clipsCount: clips.length,
            duration: duration,
        };
    };
}

export default Clips;
