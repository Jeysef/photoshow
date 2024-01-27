import { FilterType } from "../../types/enums";
import type Clip from "./Clip";
import { type IClipChildrenProps } from "./Clip";
import { type IClipModule } from "./Interface";
class Filter implements IClipModule {
    private readonly clip: Clip;
    script: string;

    constructor(props: IClipChildrenProps) {
        const { clip } = props;
        this.clip = clip;
        this.script = this.getFilter(props);
        return this;
    }

    getFilter = (props: IClipChildrenProps) => {
        const {
            clip: { filter },
        } = props;
        let filterScript = "";
        switch (filter) {
            case FilterType.BLUR:
                filterScript += "gblur=sigma=50";
                break;
            case FilterType.BLURGRAYSCALE:
                filterScript += "gblur=sigma=50,colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3";
                break;
            case FilterType.GRAYSCALE:
                filterScript += "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3";
                break;
        }
        if (this.clip.opacity !== undefined) {
            if (filterScript !== "") {
                filterScript += ",";
            }
            filterScript += `colorchannelmixer=aa=${this.clip.opacity}`;
        }
        if (filterScript !== "") {
            return `${this.clip.label}${filterScript}${this.clip.newLabel};`;
        }
        return "";
    };

    getScript = () => {
        return this.script;
    };
}

export default Filter;
