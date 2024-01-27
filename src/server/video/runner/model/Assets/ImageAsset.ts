import { type IImageAsset } from "../../../types/interfaces";
import { Asset, type AssetInput } from "../Asset";
import type Clip from "../Clip";

export class ImageAsset extends Asset {
    private readonly clip: Clip;
    private readonly asset: IImageAsset;
    type = "ImageAsset";

    constructor(props: Clip, asset: IImageAsset) {
        super(props, asset);
        this.clip = props;
        this.asset = asset;
    }

    getInput(): AssetInput {
        return {
            name: this.asset.src,
            duration: this.clip.duration,
            fps: this.clip.props.output.fps,
        };
    }
}
