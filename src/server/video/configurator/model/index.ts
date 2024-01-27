import Clip from "./Clip";
import Edit from "./Edit";
import Output from "./Output";
import Soundtrack from "./Soundtrack";
import Timeline from "./Timeline";
import Track from "./Track";
import { ImageAsset } from "./assets/ImageAsset";
import { TitleAsset } from "./assets/TitleAsset";
import { VideoAsset } from "./assets/VideoAsset";

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

    TitleAsset: TitleAsset,
};
export default Shotstack;
