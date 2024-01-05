import Clip from "./model/Clip";
import Output from "./model/Output";
import Timeline from "./model/Timeline";
import Track from "./model/Track";
import Soundtrack from "./model/Soundtrack";
import Edit from "./model/Edit";
import { VideoAsset } from "./model/assets/VideoAsset";
import { ImageAsset } from "./model/assets/ImageAsset";
import { TitleAsset } from "./model/assets/TitleAsset";

const Shotstack = {
    /**
     * The Soundtrack model constructor.
     * @property {module:model/Soundtrack}
     */
    Soundtrack: Soundtrack,

    /**
     * The ImageAsset model constructor.
     * @property {module:model/ImageAsset}
     */
    ImageAsset: ImageAsset,
    
    /**
     * The VideoAsset model constructor.
     * @property {module:model/VideoAsset}
     */
    VideoAsset: VideoAsset,

    /**
     * The Clip model constructor.
     * @property {module:model/Clip}
     */
    Clip: Clip,

    /**
     * The Track model constructor.
     * @property {module:model/Track}
     */
    Track: Track,

    /**
     * The Timeline model constructor.
     * @property {module:model/Timeline}
     */
    Timeline: Timeline,

    /**
     * The Output model constructor.
     * @property {module:model/Output}
     */
    Output: Output,

    /**
     * The Edit model constructor.
     * @property {module:model/Edit}
     */
    Edit: Edit,

    TitleAsset: TitleAsset

}
export default Shotstack;
