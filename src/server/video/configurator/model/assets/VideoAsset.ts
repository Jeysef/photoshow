import { AssetType, type VolumeEffect } from "../../../types/enums";
import { type ICrop, type IVideoAsset } from "../../../types/interfaces";
import { Asset } from "./Asset";

export class VideoAsset extends Asset implements IVideoAsset {
    private _type: AssetType.VIDEO;
    public get type(): AssetType.VIDEO {
        return this._type;
    }
    public setType(value: AssetType.VIDEO) {
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
    private _volume?: number | undefined;
    public get volume(): number | undefined {
        return this._volume;
    }
    public setVolume(value: number | undefined) {
        this._volume = value;
    }
    private _volumeEffect?: VolumeEffect | undefined;
    public get volumeEffect(): VolumeEffect | undefined {
        return this._volumeEffect;
    }
    public setVolumeEffect(value: VolumeEffect | undefined) {
        this._volumeEffect = value;
    }
    private _crop?: ICrop | undefined;
    public get crop(): ICrop | undefined {
        return this._crop;
    }
    public setCrop(value: ICrop | undefined) {
        this._crop = value;
    }

    constructor(src = "") {
        super({ type: AssetType.VIDEO, src });
        this._type = AssetType.VIDEO;
        this._src = src;
    }
}
