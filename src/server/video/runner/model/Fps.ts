import { type OutputFPS } from "../../types/enums";
import type Clip from "./Clip";
import { type IClipChildrenProps } from "./Clip";
import { type IClipModule } from "./Interface";

class Fit implements IClipModule {
    private readonly clip: Clip;
    private fps: OutputFPS;

    constructor(props: IClipChildrenProps) {
        this.clip = props.clip;
        this.fps = props.output.fps;
        return this;
    }

    addFps = () => {
        return `${this.clip.label}fps=fps=${this.fps}${this.clip.newLabel};`;
        // return `${this.clip.label}fps=fps=30,format=pix_fmts=yuv420p,settb=AVTB${this.clip.newLabel};`
    };

    public getScript = () => {
        return this.addFps();
    };
}

export default Fit;
