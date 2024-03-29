import { OutputResolution, type XFadeTransition } from "../types/enums";
import type { StreamLabel } from "../types/types";

export const getScriptForXFade = (transitionType: XFadeTransition | undefined, duration: number, offset: number) => {
    return `xfade=transition=${transitionType}:duration=${duration}:offset=${offset}`;
};

const outputResolutionToSize = {
    [OutputResolution.R4K]: { width: 3840, height: 2160 },
    [OutputResolution.FULL_HD]: { width: 1920, height: 1080 },
    [OutputResolution.HD]: { width: 1280, height: 720 },
    [OutputResolution.MOBILE]: { width: 640, height: 360 },
    [OutputResolution.SD]: { width: 1024, height: 576 },
    [OutputResolution.PREVIEW]: { width: 512, height: 288 },
};

export const getSizeFromResolution = (resolution: OutputResolution, isPortrait?: boolean) => {
    return Size.getInstance(isPortrait).getSizeForResolution(resolution);
};

export class Size {
    private static instance: Size;
    private isPortrait = false;
    private constructor(portrait: boolean) {
        this.isPortrait = portrait;
    }
    public static getInstance(portrait?: boolean) {
        if (!Size.instance) {
            Size.instance = new Size(portrait ?? false);
        }
        if (portrait !== undefined && portrait !== Size.instance.isPortrait) {
            Size.instance.isPortrait = portrait;
        }
        return Size.instance;
    }
    public getSizeForResolution(resolution: OutputResolution) {
        const { width, height } = outputResolutionToSize[resolution];
        return this.isPortrait ? { width: height, height: width } : { width, height };
    }
}

export const getText = (text: string, font: string, size: number | string, color: string, background: string, position: string, offset: string) => {
    return `drawtext=fontfile=${font}:text=${text}:fontsize=${size}:fontcolor=${color}:box=1:boxcolor=${background}:boxborderw=5:x=${position}:y=${position}:x=${offset}:y=${offset}`;
};

interface FadeTextOptions {
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

export function fadeText(options: FadeTextOptions): string {
    const { fontfile, text, fontsize, fontcolor, x, y, fadeInStart, fadeInDuration, fadeOutStart, fadeOutDuration } = options;

    /**
     * The alpha value used for fading in and out.
     *
     * @remarks
     * The alpha value is calculated based on the current time (`t`) and the specified fade-in and fade-out parameters.
     *
     * @param t - The current time.
     * @param fadeInStart - The start time of the fade-in effect.
     * @param fadeInDuration - The duration of the fade-in effect.
     * @param fadeOutStart - The start time of the fade-out effect.
     * @param fadeOutDuration - The duration of the fade-out effect.
     *
     * @returns The alpha value at the given time.
     */
    const alpha = `if(lt(t,${fadeInStart}),0,if(lt(t,${fadeInStart + fadeInDuration}),(t-${fadeInStart})/${fadeInDuration},if(lt(t,${fadeOutStart}),1,if(lt(t,${
        fadeOutStart + fadeOutDuration
    }),(1-(t-${fadeOutStart})/${fadeOutDuration}),0))))`;
    const enable = `between(t,${fadeInStart},${fadeInStart + fadeInDuration + fadeOutDuration})`;

    return `drawtext=enable='${enable}':fontfile=${fontfile}:text='${text}':fontsize=${fontsize}:fontcolor=${fontcolor}:alpha='${alpha}':x=${x}:y=${y}`;
}

interface IOverlayProps {
    /** @example [stream_1] */
    mainStream: StreamLabel;
    /** @example [stream_2] */
    overlayStream: StreamLabel;
    /** @example [stream_out] */
    outputStreamLabel: StreamLabel;
}
/** It takes two inputs and has one output. The first input is the "main" video on which the second input is overlaid. */
export const overlay = (props: IOverlayProps) => {
    // !: There is a bug in the overlay script. It makes the output video shorter.
    const index = crypto.randomUUID();
    const mainPreOverlayLabel = `[main_pre_overlay_${index}]`;
    const overlayPreMainLabel = `[overlay_pre_main_${index}]`;
    const mainPreOverlayScript = `${props.mainStream}setpts=PTS-STARTPTS${mainPreOverlayLabel};`;
    const overlayPreMainScript = `${props.overlayStream}setpts=PTS-STARTPTS${overlayPreMainLabel};`;
    return {
        // script: `${props.mainStream}${props.overlayStream}overlay${props.outputStreamLabel}`,
        script: `${mainPreOverlayScript}${overlayPreMainScript}${mainPreOverlayLabel}${overlayPreMainLabel}overlay${props.outputStreamLabel}`,
        outputStreamLabel: props.outputStreamLabel,
    };
};

export const getLabelName = (label: string) => {
    return label.slice(1, -1);
};
