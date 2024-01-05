import { type IVideoAsset } from "../../../schemas/interfaces";
import { Asset } from "../Asset";
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

    getInput(): string[] {
        // console.log("videoAsset", this.asset)
        return [...this.getDuration(), "-i", this.asset.src];
    }

    getDuration(): [string, string] {
        return ["-t", this.clip.duration.toString()];
    }
}
