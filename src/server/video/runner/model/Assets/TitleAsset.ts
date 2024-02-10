import { getSizeFromResolution } from "@/server/video/functions";
import Big from "big.js";
import { TitleSize } from "../../../types/enums";
import { type ITitleAsset } from "../../../types/interfaces";
import { Asset, type AssetInput } from "../Asset";
import type Clip from "../Clip";

export class TitleAsset extends Asset {
    private readonly clip: Clip;
    private readonly asset: ITitleAsset;
    private readonly size: { width: number; height: number };
    type = "TitleAsset";

    constructor(props: Clip, asset: ITitleAsset) {
        super(props, asset);
        this.clip = props;
        this.asset = asset;
        this.size = getSizeFromResolution(this.clip.props.output.resolution);
    }

    getInput(): AssetInput {
        const background = this.asset.background ?? "black@0.0";
        // const similarity = 0.1; // 0.01 - 1.0
        // const blend = 0.0; // 0.0 - inf

        // return ["-f", "lavfi", ...this.getDuration(), "-i", `color=color=${background}:size=${this.size.width}x${this.size.height},format=rgba`];
        return {
            name: `color=color=${background}:size=${this.size.width}x${this.size.height},format=rgba`,
            duration: this.clip.duration,
            format: "lavfi",
        };
    }

    /** source: https://ffmpeg.org/ffmpeg-all.html#chromakey-1 */
    getCustomScript(): string {
        // const color = this.asset.background ?? "#000000";
        // const similarity = 0.1; // 0.01 - 1.0
        // const blend = 0.0; // 0.0 - inf
        return fadeText({
            input: this.clip.label,
            output: this.clip.newLabel,
            fontfile: this.fonts.biennale_regular,
            text: this.asset.text,
            fontsize: this.getTitleSizeToFontSize(this.asset.size),
            fontcolor: this.asset.color ?? "#ffffff",
            x: "(w-text_w)/2",
            y: "(h-text_h)/2",
            fadeInStart: 0,
            fadeInDuration: 1,
            fadeOutStart: this.clip.duration.sub(1).round(Big.DP).toNumber(),
            fadeOutDuration: 1,
        });
    }

    private fonts = {
        biennale_regular: "assets/fonts/biennale_regular.otf",
        biennale_semibold: "assets/fonts/biennale_semibold.otf",
    };

    private getTitleSizeToFontSize = (size?: TitleSize) => {
        switch (size) {
            case TitleSize.LARGE:
                return 60;
            case TitleSize.MEDIUM:
                return 40;
            case TitleSize.SMALL:
                return 20;
            default:
                return 40;
        }
    };
}

interface FadeTextOptions {
    input: string;
    output: string;
    fontfile: string;
    text: string;
    fontsize: number;
    fontcolor: string;
    x: string;
    y: string;
    fadeInStart: number;
    fadeInDuration: number;
    fadeOutStart: number;
    fadeOutDuration: number;
}

function fadeText(options: FadeTextOptions): string {
    // TODO: I don't like the divisions are made in the string
    const { input, output, fontfile, text, fontsize, fontcolor, x, y, fadeInStart, fadeInDuration, fadeOutStart, fadeOutDuration } = options;

    const alpha = `if(lt(t,${fadeInStart}),0,if(lt(t,${fadeInStart + fadeInDuration}),(t-${fadeInStart})/${fadeInDuration},if(lt(t,${fadeOutStart}),1,if(lt(t,${
        fadeOutStart + fadeOutDuration
    }),(1-(t-${fadeOutStart})/${fadeOutDuration}),0))))`;

    return `${input}drawtext=fontfile=${fontfile}:text='${text}':fontsize=${fontsize}:fontcolor=${fontcolor}:alpha='${alpha}':x=${x}:y=${y}${output}`;
}
