import { type ILumaAsset } from "../../../types/interfaces";
import { Asset, type AssetInput } from "../Asset";
import type Clip from "../Clip";

export class LumaAsset extends Asset {
    private readonly clip: Clip;
    private readonly asset: ILumaAsset;
    type = "LumaAsset";

    constructor(props: Clip, asset: ILumaAsset) {
        super(props, asset);
        this.clip = props;
        this.asset = asset;
    }

    getInput(): AssetInput {
        // console.log("lumaAsset", this.asset)
        // return ["-i", this.asset.src, ...this.getDuration()];
        return {
            duration: this.clip.duration,
            name: this.asset.src,
        };
    }
}
