import { type IHtmlAsset } from "../../../schemas/interfaces";
import { Asset } from "../Asset";
import type Clip from "../Clip";

export class HtmlAsset extends Asset {
    private readonly clip: Clip;
    private readonly asset: IHtmlAsset;
    type = "HtmlAsset";

    constructor(props: Clip, asset: IHtmlAsset) {
        super(props, asset);
        this.clip = props;
        this.asset = asset;
    }

    getInput(): string[] {
        // console.log("htmlAsset", this.asset)
        return ["", "", ...this.getDuration()];
    }

    getDuration(): [string, string] {
        return ["", ""];
    }
}
