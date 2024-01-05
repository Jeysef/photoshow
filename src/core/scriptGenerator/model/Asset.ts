import { type IAsset } from "../../schemas/interfaces";
import type Clip from "./Clip";

export abstract class Asset {
    abstract getInput(): string[];
    abstract getDuration(): [string, string];
    public getCustomScript(): string {
        return "";
    }
    abstract type: string;

    constructor(_props: Clip, _asset: IAsset) {
        undefined;
    }
}
