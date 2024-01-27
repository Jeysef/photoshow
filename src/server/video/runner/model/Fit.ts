import { FitType } from "../../types/enums";
import type Clip from "./Clip";
import { type IClipChildrenProps } from "./Clip";
import { type IClipModule } from "./Interface";

class Fit implements IClipModule {
    public script: string;
    private readonly clip: Clip;

    constructor(props: IClipChildrenProps) {
        this.clip = props.clip;
        this.script = this.addFitType(props);
        return this;
    }

    addFitType = (props: IClipChildrenProps) => {
        const { clip, output, background } = props;
        const { width, height } = output.size;
        let script = this.clip.label;
        switch (clip.fit) {
            case FitType.CROP:
                script += `scale=w='if(gte(iw/ih,${width}/${height}),-1,${width})':h='if(gte(iw/ih,${width}/${height}),${height},-1)',crop=${width}:${height},setdar=${width}/${height}`;
                break;
            case FitType.COVER:
                script += `scale=w='if(gt(iw/ih,${width}/${height}),${width},-1)':h='if(gt(iw/ih,${width}/${height}),-1,${height})',pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:black,setdar=${width}/${height}`;
                break;
            case FitType.CONTAIN:
                script += `scale=w='if(gt(iw/ih,${width}/${height}),${width},-1)':h='if(gt(iw/ih,${width}/${height}),-1,${height})',pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:${background},setdar=${width}/${height}`;
        }
        script += `${this.clip.newLabel};`;
        return script;
    };

    public getScript = () => {
        return this.script;
    };
}

export default Fit;
