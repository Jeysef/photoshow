import { type IVideoAsset } from "../../../types/interfaces";
import { Asset, type AssetInput } from "../Asset";
import type Clip from "../Clip";

export class VideoAsset extends Asset {
    private readonly clip: Clip;
    private readonly asset: IVideoAsset;
    type = "VideoAsset";

    constructor(props: Clip, asset: IVideoAsset) {
        super(props, asset);
        this.clip = props;
        this.asset = asset;
    }

    getInput(): AssetInput {
        return {
            name: this.asset.src,
            duration: this.clip.duration,
        };
    }
}
