import type RendererClip from "../../configurator/model/Clip";
import type Output from "../../configurator/model/Output";
import { AssetType, type FilterType, type FitType, type TextPosition } from "../../types/enums";
import {
    type IAudioAsset,
    type IClip,
    type IEffect,
    type IHtmlAsset,
    type IImageAsset,
    type ILumaAsset,
    type IOffset,
    type ITitleAsset,
    type ITransform,
    type ITransition,
    type IVideoAsset,
} from "../../types/interfaces";
import { type Asset } from "./Asset";
import { AudioAsset } from "./Assets/AudioAsset";
import { HtmlAsset } from "./Assets/HtmlAsset";
import { ImageAsset } from "./Assets/ImageAsset";
import { LumaAsset } from "./Assets/LumaAsset";
import { TitleAsset } from "./Assets/TitleAsset";
import { VideoAsset } from "./Assets/VideoAsset";
import Duration from "./Duration";
import Effect from "./Effects";
import Filter from "./Filter";
import Fit from "./Fit";
import Format from "./Format";
import Fps from "./Fps";
import { type IClipInterface } from "./Interface";
import Start from "./Start";

export interface IClipProps {
    clip: RendererClip;
    index: number;
    output: Output;
    background?: string;
}

export interface IClipChildrenProps extends Omit<IClipProps, "clip" | "index"> {
    clip: Clip;
}

class Clip implements IClipInterface, Omit<IClip, "asset"> {
    private _labelIndex = 0;
    public index: number;
    public label: string;

    public fit?: FitType;
    public scale?: number;
    public position?: TextPosition;
    public offset?: IOffset;
    public transition?: ITransition;
    public effects: IEffect[];
    public filter?: FilterType;
    public opacity?: number;
    public transform?: ITransform;

    public start: number;
    public duration: number;

    private readonly childrenProps: IClipChildrenProps;
    asset: Asset;

    constructor(public props: IClipProps) {
        this.index = props.index;
        this.fit = props.clip.fit;
        // this.scale = props.clip.scale;
        // this.position = props.clip.position;
        // this.offset = props.clip.offset;
        this.transition = props.clip.transition;
        this.effects = props.clip.effects;
        // this.filter = props.clip.filter;
        this.opacity = props.clip.opacity;
        // this.transform = props.clip.transform;
        this.start = props.clip.start;
        this.duration = props.clip.length;
        this.childrenProps = {
            output: props.output,
            background: props.background,
            clip: this,
        };
        this.label = `[${this.index}:v]`;

        // console.log("assetType: ", props.clip.asset.type)
        switch (props.clip.asset.type) {
            case AssetType.VIDEO:
                this.asset = new VideoAsset(this, props.clip.asset as IVideoAsset);
                break;
            case AssetType.IMAGE:
                this.asset = new ImageAsset(this, props.clip.asset as IImageAsset);
                break;
            case AssetType.TITLE:
                this.asset = new TitleAsset(this, props.clip.asset as ITitleAsset);
                break;
            case AssetType.HTML:
                this.asset = new HtmlAsset(this, props.clip.asset as IHtmlAsset);
                break;
            case AssetType.AUDIO:
                this.asset = new AudioAsset(this, props.clip.asset as IAudioAsset);
                break;
            case AssetType.LUMA:
                this.asset = new LumaAsset(this, props.clip.asset as ILumaAsset);
                break;
        }

        return this;
    }
    public get newLabel() {
        this.label = `[stream${this.index}version${this._labelIndex++}]`;
        return this.label;
    }

    private getFilterOrderArray: (keyof IClipInterface)[] = [
        // "startScript",
        // "formatScript",
        "fitScript",
        "filterScript",
        // "effectScript",
        // "fpsScript",
        "customScript",
    ];

    public getScript(): string {
        // return this.getFilterOrderArray.map((key) => this[key]).join("");
        // return (
        //     this.label +
        //     new Duration(this.childrenProps).getScript() +
        //     "," +
        //     new Fit(this.childrenProps).getScript() +
        //     "," +
        //     // new Filter(this.childrenProps).getScript(),
        //     new Effect(this.childrenProps).getScript() +
        //     "," +
        //     new Duration(this.childrenProps).getScript() +
        //     "," +
        //     (this.asset.getCustomScript() ? this.asset.getCustomScript() + "," : "") +
        //     this.newLabel +
        //     ";"
        // );
        return (
            new Script()
                .addInLabel(this.label)
                .add(new Duration(this.childrenProps).getScript())
                // .add(new Fit(this.childrenProps).getScript())
                .add(new Effect(this.childrenProps).getScript())
                .add(new Duration(this.childrenProps).getScript())
                .add(this.asset.getCustomScript())
                .addOutLabel(this.newLabel)
                .get()
        );
    }

    get customScript(): string {
        return this.asset.getCustomScript() ?? "";
    }

    get fitScript(): string {
        return new Fit(this.childrenProps).getScript();
    }
    get fpsScript(): string {
        return new Fps(this.childrenProps).getScript();
    }
    get filterScript(): string {
        return new Filter(this.childrenProps).getScript();
    }
    get effectScript(): string {
        return new Effect(this.childrenProps).getScript();
    }
    get formatScript(): string {
        return new Format(this.childrenProps).getScript();
    }
    get startScript(): string {
        return new Start(this.childrenProps).getScript();
    }
}

export default Clip;

class Script {
    private inLabel = "";
    private outLabel = "";
    private script = "";

    addInLabel = (label: string) => {
        this.inLabel = label;
        return this;
    };

    addOutLabel = (label: string) => {
        this.outLabel = label;
        return this;
    };

    add = (script: string) => {
        if (this.script !== "" && script !== "") {
            this.script += ",";
        }
        this.script += script;
        return this;
    };

    get = () => {
        return this.inLabel + this.script + this.outLabel + ";";
    };
}
