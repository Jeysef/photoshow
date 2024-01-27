import { AssetType, type VolumeEffect } from "../../../types/enums";
import { type IAudioAsset } from "../../../types/interfaces";
import { Asset } from "./Asset";

export class AudioAsset extends Asset implements IAudioAsset {
    private _type: AssetType.AUDIO = AssetType.AUDIO;
    public get type(): AssetType.AUDIO {
        return this._type;
    }
    public setType(value: AssetType.AUDIO) {
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
    private _volume?: number | undefined; // 0-1
    public get volume(): number | undefined {
        return this._volume;
    }
    public setVolume(value: number | undefined) {
        this._volume = value;
    }
    private _effect?: VolumeEffect | undefined;
    public get effect(): VolumeEffect | undefined {
        return this._effect;
    }
    public setEffect(value: VolumeEffect | undefined) {
        this._effect = value;
    }

    constructor(src = "") {
        super({ type: AssetType.AUDIO, src });
        this._src = src;
    }
}
