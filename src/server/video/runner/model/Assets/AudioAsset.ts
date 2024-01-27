import { type IAudioAsset } from "../../../types/interfaces";
import { Asset, type AssetInput } from "../Asset";
import type Clip from "../Clip";

export class AudioAsset extends Asset {
    private readonly clip: Clip;
    private readonly asset: IAudioAsset;
    type = "AudioAsset";

    constructor(props: Clip, asset: IAudioAsset) {
        super(props, asset);
        this.clip = props;
        this.asset = asset;
    }

    getInput(): AssetInput {
        // console.log("audioAsset", this.asset)
        // return [...this.getDuration(), "-i", this.asset.src];
        return {
            duration: this.clip.duration,
            name: this.asset.src,
        };
    }
}
