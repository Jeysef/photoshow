import {type IClipChildrenProps} from "./Clip";
import type Clip from "./Clip";
import { type IClipModule } from "./Interface";

class Start implements IClipModule {
    private readonly clip: Clip;

    constructor(props: IClipChildrenProps) {
        this.clip = props.clip;
        return this;
    }

    addStart = () => {
        return `${this.clip.label}setpts=PTS-STARTPTS+${this.clip.start}/TB${this.clip.newLabel};`
    }

    public getScript = () => {
        return this.addStart();
    }
}

export default Start;