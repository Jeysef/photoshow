import { type IImageAsset } from "../../../schemas/interfaces";
import { Asset } from "../Asset";
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

    getInput(): string[] {
        // console.log("ImageAsset", this.asset)
        return ["-framerate", `${this.clip.props.output.fps}`, "-loop", "1", ...this.getDuration(), "-i", this.asset.src];
    }

    getDuration(): [string, string] {
        return ["-t", this.clip.duration.toString()];
    }
}
