import { getScriptForXFade } from "../../functions";
import { ConnectEffect, EffectEffect, MotionEffect, XFadeTransition, type OutputFPS } from "../../types/enums";
import { type IMotionEffect } from "../../types/interfaces";
import { roundedSum } from "../../utils/utils";
import { type IClipChildrenProps } from "./Clip";
import { type IClipModule } from "./Interface";

export enum ZoomPosition {
    TOP_LEFT = "TOP_LEFT",
    TOP_RIGHT = "TOP_RIGHT",
    BOTTOM_LEFT = "BOTTOM_LEFT",
    BOTTOM_RIGHT = "BOTTOM_RIGHT",
    //CENTER = "CENTER",
}
export interface ISpeed {
    slow: number;
    medium: number;
    fast: number;
}

class Effect implements IClipModule {
    static readonly speed: ISpeed = {
        slow: 1.5,
        medium: 2.5,
        fast: 3.5,
    };
    private readonly zoom: Zoom;

    constructor(private readonly props: IClipChildrenProps) {
        this.zoom = new Zoom(props);
        return this;
    }

    private getEffects = () => {
        const effectScript: string[] = [];
        const splitLabels: string[] = [];

        const appendComma = () => {
            effectScript.push(",");
        };

        this.props.clip.effects.forEach((effect, index) => {
            if (index !== 0) {
                const currentEffectIsConnect = effect.type === ConnectEffect.CONNECT;
                if (!currentEffectIsConnect) {
                    appendComma();
                }
            }

            if (effect.type.startsWith("ZOOM_IN")) {
                effect = effect as IMotionEffect;
                effectScript.push(this.zoom.zoomIn(effect.speed, effect.type));
            }
            if (effect.type.startsWith("ZOOM_OUT")) {
                effect = effect as IMotionEffect;
                effectScript.push(this.zoom.zoomOut(effect.speed, effect.type));
            }
            if (effect.type === EffectEffect.BLUR) {
                effectScript.push(this.blur(effect.duration, effect.speed));
            }
            if (effect.type === EffectEffect.GRAYSCALE) {
                effectScript.push(this.grayscale(effect.duration, effect.speed));
            }
            if (effect.type === ConnectEffect.SPLIT) {
                if (roundedSum(undefined, effect.stream1Duration, effect.stream2Duration) !== this.props.clip.duration) {
                    throw new Error(
                        "Sum of split effect durations is not equal to clip duration. Stream1: " +
                            effect.stream1Duration +
                            " Stream2: " +
                            effect.stream2Duration +
                            " Clip duration: " +
                            this.props.clip.duration,
                    );
                }
                const splitLabel0 = `[effect_split${this.props.clip.index}_${index}no0_0]`;
                const splitLabel1 = `[effect_split${this.props.clip.index}_${index}no1_0]`;
                const splitLabel1_1 = `[effect_split${this.props.clip.index}_${index}no1_1]`;
                effectScript.push(`split=2${splitLabel0}${splitLabel1};`);
                effectScript.push(`${splitLabel1}trim=start=${this.props.clip.duration - effect.stream2Duration}${splitLabel1_1};`);
                splitLabels.push(splitLabel1_1);
                /**
                 * this stream is extended by connect duration because the extension is overlaid by xfade
                 */
                effectScript.push(`${splitLabel0}trim=end=${effect.stream1Duration + effect.connectDuration}`);
            }
            if (effect.type === ConnectEffect.CONNECT) {
                /**
                 * only temporary label is used here
                 */
                const splitLabel0_1 = `[effect_split${this.props.clip.index}_${index}no0_1]`;
                if (!splitLabels.length) throw new Error("Connect effect is being used without split effect");

                const code =
                    splitLabel0_1 +
                    ";" +
                    splitLabel0_1 +
                    splitLabels.shift() +
                    getScriptForXFade(effect.transition ?? XFadeTransition.FADE, effect.duration, effect.offset);
                effectScript.push(code);
            }
        });
        return effectScript.join("");
    };

    /** pure */
    private blur = (duration: number, speed: number) => {
        // const blurSpeed = speed;
        // const blurDuration = duration;
        const maxBlur = 20;
        if (speed === 0) return `gblur=sigma=${maxBlur}`;
        return `gblur=sigma=${maxBlur}`; // TODO: add blur speed
    };

    /** pure */
    private grayscale = (_duration: number, _speed: number) => {
        // return `colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3`;
        return `hue=s=0`;
    };

    public getScript = () => {
        if (this.props.clip.effects.length === 0) return "";
        return this.getEffects();
    };
}

export default Effect;

class Zoom {
    private readonly frames: number;
    private readonly width: number;
    private readonly height: number;
    private readonly scriptForZoomPosition: (zoomPosition: MotionEffect) => string;
    private readonly fps: OutputFPS;
    private readonly scaleUp: string;
    private readonly scaleBack: string;
    private readonly fpsScript: string;

    constructor(private readonly props: IClipChildrenProps) {
        this.frames = props.clip.duration * props.output.fps;
        const {
            output: { size, fps },
        } = props;
        const { width, height } = size;
        this.width = width;
        this.height = height;
        this.fps = fps;
        this.scriptForZoomPosition = this.getScriptForZoomPosition(width, height);
        const scaleUpMultiplier = 10;
        this.scaleUp = `scale=${width * scaleUpMultiplier}:${height * scaleUpMultiplier}`;
        this.scaleBack = `s=${width}x${height}`;
        this.fpsScript = `fps=${this.fps}`;
    }

    public zoomIn = (zoomSpeed: number, zoomPosition: MotionEffect, zoomMax = 10) => {
        const speed = zoomSpeed;
        return `${this.scaleUp},zoompan=z='min(zoom+0.001*${speed},${zoomMax})':d=${this.frames}:${this.scriptForZoomPosition(zoomPosition)}:${this.fpsScript}:${this.scaleBack}`;
    };

    public zoomOut = (zoomSpeed: number, zoomPosition: MotionEffect, startingZoom = 1.5, zoomMin = 1.001) => {
        const speed = zoomSpeed;
        const frames = Math.floor(this.props.clip.duration * this.fps);
        if (startingZoom < 1) {
            throw new Error("startingZoom must be greater than 1");
        }
        if (zoomMin < 1) {
            throw new Error("zoomMin must be greater than 1");
        }

        return `${this.scaleUp},zoompan=z='if(lte(zoom,1.0),${startingZoom},max(${zoomMin},zoom-0.001*${speed}))':d=${frames}:${this.scriptForZoomPosition(zoomPosition)}:${this.fpsScript}:${this.scaleBack}`;
    };

    private getScriptForZoomPosition(width: number, height: number) {
        return (zoomPosition: MotionEffect) => {
            switch (zoomPosition) {
                case MotionEffect.ZOOM_IN_TOP_LEFT:
                case MotionEffect.ZOOM_OUT_TOP_LEFT:
                    return `x='${width}-(iw/zoom/2)':y='-${height}-(ih/zoom/2)'`;
                case MotionEffect.ZOOM_IN_TOP_RIGHT:
                case MotionEffect.ZOOM_OUT_TOP_RIGHT:
                    return `x='iw/2':y='-${height}-(ih/zoom/2)'`;
                case MotionEffect.ZOOM_IN_BOTTOM_LEFT:
                case MotionEffect.ZOOM_OUT_BOTTOM_LEFT:
                    return `x='${width}-(iw/zoom/2)':y='${height}+(ih/zoom/2)'`;
                case MotionEffect.ZOOM_IN_BOTTOM_RIGHT:
                case MotionEffect.ZOOM_OUT_BOTTOM_RIGHT:
                    return `x='iw/2':y='(ih/zoom/2)'`;
                case MotionEffect.ZOOM_IN_CENTER:
                case MotionEffect.ZOOM_OUT_CENTER:
                    return `x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`;
            }
        };
    }
}