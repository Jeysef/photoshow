import { FilterType } from "../../types/enums";
import { type IClipChildrenProps } from "./Clip";
import { type IClipModule } from "./Interface";
class Filter implements IClipModule {
    constructor(private readonly props: IClipChildrenProps) {}

    getFilter = (props: IClipChildrenProps) => {
        const { clip } = props;
        const { filter } = clip;
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
        if (clip.opacity !== undefined) {
            if (filterScript !== "") {
                filterScript += ",";
            }
            filterScript += `colorchannelmixer=aa=${clip.opacity}`;
        }
        return filterScript;
    };

    getScript = () => {
        return this.getFilter(this.props);
    };
}

export default Filter;
