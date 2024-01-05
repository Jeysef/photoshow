import { type IAudioAsset } from "../../../schemas/interfaces";
import { Asset } from "../Asset";
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

    getInput(): string[] {
        // console.log("audioAsset", this.asset)
        return [...this.getDuration(), "-i", this.asset.src];
    }

    getDuration(): [string, string] {
        return ["-t", this.clip.duration.toString()]; // cut audio to the duration of the video !(audio may be shorter than video)
    }
}
