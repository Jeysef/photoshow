import { type ILumaAsset } from "../../../schemas/interfaces";
import { Asset } from "../Asset";
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

    getInput(): string[] {
        // console.log("lumaAsset", this.asset)
        return ["-i", this.asset.src, ...this.getDuration()];
    }

    getDuration(): [string, string] {
        return ["-t", this.clip.duration.toString()];
    }
}
