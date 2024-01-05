import { AssetType } from "../../../schemas/enums";
import { type ICrop, type IImageAsset } from "../../../schemas/interfaces";
import { Asset } from "./Asset";

export class ImageAsset extends Asset implements IImageAsset{
    private _type: AssetType.IMAGE = AssetType.IMAGE;
    public get type(): AssetType.IMAGE {
        return this._type;
    }
    public setType(value: AssetType.IMAGE) {
        this._type = value;
    }
    private _src: string;
    public get src(): string {
        return this._src;
    }
    public setSrc(value: string) {
        this._src = value;
    }
    private _crop?: ICrop | undefined;
    public get crop(): ICrop | undefined {
        return this._crop;
    }
    public setCrop(value: ICrop | undefined) {
        this._crop = value;
    }

    constructor(src = "") {
        super({type: AssetType.IMAGE, src});
        this._type = AssetType.IMAGE;
        this._src = src;
    }
}
