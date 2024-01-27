import type { IAsset } from "../../types/interfaces";
import type Clip from "./Clip";

export type AssetInput = {
    format?: string;
    name: string;
    fps?: number;
    duration: number;
};

export abstract class Asset {
    abstract getInput(): AssetInput;
    public getCustomScript(): string {
        return "";
    }
    abstract type: string;

    constructor(_props: Clip, _asset: IAsset) {
        undefined;
    }
}
