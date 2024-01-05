import { OutputResolution, type XFadeTransition } from "../../schemas/enums";

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
            Size.instance = new Size(portrait?? false);
        }
        if (portrait) {
            Size.instance.isPortrait = portrait;
        }
        return Size.instance;
    }
    public getSizeForResolution(resolution: OutputResolution) {
        const {width, height} = outputResolutionToSize[resolution]
        return this.isPortrait ? {width: height, height: width} : {width, height};
    }
}

export const getText = (text: string, font: string, size: number | string, color: string, background: string, position: string, offset: string) => {
    return `drawtext=fontfile=${font}:text=${text}:fontsize=${size}:fontcolor=${color}:box=1:boxcolor=${background}:boxborderw=5:x=${position}:y=${position}:x=${offset}:y=${offset}`;
};

interface IOverlayProps {
    /** @example [stream_1] */
    mainStream: string;
    /** @example [stream_2] */
    overlayStream: string;
    /** @example [stream_out] */
    outputStreamLabel: string;
}
/** It takes two inputs and has one output. The first input is the "main" video on which the second input is overlaid. */
export const overlay = (props: IOverlayProps) => {
    return {
        script: `${props.mainStream}${props.overlayStream}overlay=repeatlast=0${props.outputStreamLabel}`,
        outputStreamLabel: props.outputStreamLabel,
    };
};

export const getLabelName = (label: string) => {
    return label.slice(1, -1);
};
