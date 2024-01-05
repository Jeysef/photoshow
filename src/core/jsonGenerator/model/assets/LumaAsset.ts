import { AssetType } from "../../../schemas/enums";
import { type ILumaAsset } from "../../../schemas/interfaces";
import { Asset } from "./Asset";

export class LumaAsset extends Asset implements ILumaAsset {
    private _type: AssetType.LUMA = AssetType.LUMA;
    public get type(): AssetType.LUMA {
        return this._type;
    }
    public setType(value: AssetType.LUMA) {
        this._type = value;
    }
    private _src: string;
    public get src(): string {
        return this._src;
    }
    public setSrc(value: string) {
        this._src = value;
    }
    private _trim?: number | undefined;
    public get trim(): number | undefined {
        return this._trim;
    }
    public setTrim(value: number | undefined) {
        this._trim = value;
    }

    constructor(src = "") {
        super({type: AssetType.LUMA, src});
        this._type = AssetType.LUMA;
        this._src = src;
    }
}