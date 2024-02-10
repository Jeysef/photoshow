import Big from "big.js";
import { type IHtmlAsset } from "../../../types/interfaces";
import { Asset, type AssetInput } from "../Asset";
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

    getInput(): AssetInput {
        // console.log("htmlAsset", this.asset)
        // return ["", "", ...this.getDuration()];
        return {
            duration: Big("0"),
            name: "",
        };
    }
}
