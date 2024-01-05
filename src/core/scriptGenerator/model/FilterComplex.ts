// import { AssetType, OutputFPS, XFadeTransition } from "../../schemas/enums";
// import RendererClip from "../../jsonGenerator/model/Clip";
// import Output from "../../jsonGenerator/model/Output";
// import Clip from "./Clip";
// import { getScriptForXFade } from "../functions/functions";
// import { IClipFilterComplexModule } from "./Interface";

// // Builder for organizing the filters in a complex filter chain

// export interface IFilterComplexProps {
//     clips: RendererClip[];
//     output: Output;
//     background?: string;
// }
// class FilterComplex {
//     public clips: Clip[];
//     private _outputStreamLabel?: string;

//     constructor(props: IFilterComplexProps) {
//         this.clips = this._getFilters(props);
//     }
//     private _getFilters = (props: IFilterComplexProps): Clip[] =>  {
//         const { clips } = props;
//         const imageClips = clips.reduce((acc, clip, index) => {
//             // if (clip.asset.type === AssetType.IMAGE) {
//                 acc.push(new Clip({ clip, index, ...props }));
//             // }
//             return acc;
//         }, [] as Clip[]);

//         return imageClips;
//     }

//     // After this function is caalled, the clip labels should not be used
//     private concatFilters = () => {
//         let currentStreamLabel = this.clips[0].label;
//         let offset = 0;
//         const script: string = this.clips.slice(0, -1).map((clip, index) => {
//             if (clip.transition && clip.length < 0.5) {
//                 throw new Error("Transition duration is less than 0.5 seconds, Which is needed for the crossfade to work.");
//             }
//             const currentClip = clip;
//             const nextClip = this.clips[index+1];
//             const outputStreamLabel = `[stream:C${index}-C${index+1}]`;
//             const duration = currentClip.transition ? 0.5 : 0;
//             offset += currentClip.length - duration;

//             let transition: XFadeTransition | undefined;
//             if (currentClip.transition?.out === undefined && nextClip.transition?.in === undefined) {
//                 transition = undefined;
//             } else if (currentClip.transition?.out === nextClip.transition?.in) {
//                 transition = currentClip.transition?.out;
//             } else {
//                 throw new Error(`Transition in and out do not match on index: ${index}`);
//             }
//             let script: string;
//             if (transition === undefined) {
//                 script = currentStreamLabel + nextClip.label + "concat=n=2" + outputStreamLabel;
//             } else {
//                 script = currentStreamLabel + nextClip.label + getScriptForXFade(transition, duration, offset) + outputStreamLabel;
//             }

//             currentStreamLabel = outputStreamLabel;
//             return script;
//         }).join(";");
//         this._outputStreamLabel = currentStreamLabel;
//         return script;
//     }

//     // private getFilterOrderArray: (keyof IClipFilterComplexModule)[] = [
//     //     "startScript",
//     //     "formatScript",
//     //     "fitScript",
//     //     "filterScript",
//     //     "effectScript",
//     //     "fpsScript",
//     // ]

//     // public getFilterComplex = (): string => {
//     //     let script = this.getFilterOrderArray.map((key) => {
//     //         return this.clips.map((clip) => clip[key]).join("");
//     //     }).join("");
//     //     script += this.concatFilters()
//     //     return script
//     // }
//     // public getFilterComplex = (): string => {
//     //     const script =this.clips.map((clip) => this.getFilterOrderArray.map((key) => clip[key]).join("")).join("");
//     //     return script + this.concatFilters()
//     // }
//     public getFilterComplex = (): string => {
//         const script =this.clips.map((clip) => clip.script).join("");
//         return script + this.concatFilters()
//     }

//     get outputStreamLabel(): string {
//         if (!this._outputStreamLabel) {
//             throw new Error("outputStreamLabel is not defined. Call getFilterComplex first.");
//         }
//         return this._outputStreamLabel;
//     }
// }

// export default FilterComplex;
