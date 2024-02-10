import { type Big } from "big.js";
import { FitType } from "../../types/enums";
import { type IEffect, type ITransition } from "../../types/interfaces";
import { type Asset } from "./assets/Asset";

class Clip {
    private _asset?: Asset;
    private _start?: Big;
    private _length?: Big;
    fit?: FitType = FitType.CROP;
    transition?: ITransition;
    effects: IEffect[] = [];
    opacity?: number;

    constructor(asset?: Asset, start?: Big, length?: Big) {
        this._asset = asset;
        this._start = start;
        this._length = length;
    }

    /**
     * @param {module:model/Asset} asset
     */
    public setAsset = (asset: Asset) => {
        this._asset = asset;
        return this;
    };

    get asset(): Asset {
        if (this._asset === undefined) {
            throw new Error("Asset is undefined");
        }
        return this._asset;
    }

    /**
     * Sets The start position of the Clip on the timeline, in seconds.
     * @param {Big} start The start position of the Clip on the timeline, in seconds.
     */
    public setStart = (start: Big) => {
        this._start = start;
        return this;
    };

    get start(): Big {
        if (this._start === undefined) {
            throw new Error("Start is undefined");
        }
        return this._start;
    }

    /**
     * Sets The length, in seconds, the Clip should play for.
     * @param {Big} length The length, in seconds, the Clip should play for.
     */
    public setLength = (length: Big) => {
        this._length = length;
        return this;
    };

    get length(): Big {
        if (this._length === undefined) {
            throw new Error("Length is undefined");
        }
        return this._length;
    }

    /**
     * Sets A motion effect to apply to the Clip. <ul>   <li>`zoomIn` - slow zoom in</li>   <li>`zoomOut` - slow zoom out</li>   <li>`slideLeft` - slow slide (pan) left</li>   <li>`slideRight` - slow slide (pan) right</li>   <li>`slideUp` - slow slide (pan) up</li>   <li>`slideDown` - slow slide (pan) down</li> </ul> The motion effect speed can also be controlled by appending `Fast` or `Slow` to the effect, e.g. `zoomInFast` or `slideRightSlow`.
     * @param {module:model/Clip.EffectEnum} effect A motion effect to apply to the Clip. <ul>   <li>`zoomIn` - slow zoom in</li>   <li>`zoomOut` - slow zoom out</li>   <li>`slideLeft` - slow slide (pan) left</li>   <li>`slideRight` - slow slide (pan) right</li>   <li>`slideUp` - slow slide (pan) up</li>   <li>`slideDown` - slow slide (pan) down</li> </ul> The motion effect speed can also be controlled by appending `Fast` or `Slow` to the effect, e.g. `zoomInFast` or `slideRightSlow`.
     */
    public addEffect = (effect: IEffect, index?: number) => {
        if (index === undefined) {
            this.effects.push(effect);
            return this;
        }
        this.effects.splice(index, 0, effect);
        return this;
    };

    public setEffect = (effect: IEffect[]) => {
        this.effects = effect;
        return this;
    };

    /**
     * Sets Set how the asset should be scaled to fit the viewport using one of the following options:    <ul>     <li>`crop` <b>(default)</b> - scale the asset to fill the viewport while maintaining the aspect ratio. The asset will be cropped if it exceeds the bounds of the viewport.</li>     <li>`cover` - stretch the asset to fill the viewport without maintaining the aspect ratio.</li>     <li>`contain` - fit the entire asset within the viewport while maintaining the original aspect ratio.</li>     <li>`none` - preserves the original asset dimensions and does not apply any scaling.</li>   </ul>
     * @param {module:model/Clip.FitEnum} fit Set how the asset should be scaled to fit the viewport using one of the following options:    <ul>     <li>`crop` <b>(default)</b> - scale the asset to fill the viewport while maintaining the aspect ratio. The asset will be cropped if it exceeds the bounds of the viewport.</li>     <li>`cover` - stretch the asset to fill the viewport without maintaining the aspect ratio.</li>     <li>`contain` - fit the entire asset within the viewport while maintaining the original aspect ratio.</li>     <li>`none` - preserves the original asset dimensions and does not apply any scaling.</li>   </ul>
     */
    public setFit = (fit: FitType) => {
        this.fit = fit;
        return this;
    };

    /**
     * Sets The transition to apply to the Clip. <ul>   <li>`none` <b>(default)</b> - no transition</li>   <li>`fade` - fade in</li>   <li>`slideLeft` - slide in from the left</li>   <li>`slideRight` - slide in from the right</li>   <li>`slideUp` - slide in from the top</li>   <li>`slideDown` - slide in from the bottom</li> </ul>
     * @param {module:model/Clip.TransitionEnum} transition The transition to apply to the Clip. <ul>   <li>`none` <b>(default)</b> - no transition</li>   <li>`fade` - fade in</li>   <li>`slideLeft` - slide in from the left</li>   <li>`slideRight` - slide in from the right</li>   <li>`slideUp` - slide in from the top</li>   <li>`slideDown` - slide in from the bottom</li> </ul>
     */
    public setTransition = (transition: ITransition) => {
        this.transition = transition;
        return this;
    };

    public setOpacity = (opacity: number) => {
        this.opacity = opacity;
        return this;
    };
}

export default Clip;
