import Big from "big.js";
import { type OutputFPS } from "../../types/enums";
import type Clip from "./Clip";
import { type IClipChildrenProps } from "./Clip";
import { type IClipModule } from "./Interface";

class Duration implements IClipModule {
    private readonly clip: Clip;
    private fps: OutputFPS;

    constructor(props: IClipChildrenProps) {
        this.clip = props.clip;
        this.fps = props.output.fps;
        return this;
    }

    addDuration = () => {
        return `trim=duration=${this.clip.duration.round(Big.DP).toNumber()}`;
    };

    public getScript = () => {
        return this.addDuration();
    };
}

export default Duration;
