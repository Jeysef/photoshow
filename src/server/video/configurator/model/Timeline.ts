import type Soundtrack from "./Soundtrack";
import type Track from "./Track";
class Timeline {
    private _tracks?: Track[];
    background?: string;
    soundtrack?: Soundtrack;
    title?: string;

    constructor(tracks?: Track[]) {
        this._tracks = tracks;
    }

    /**
     * Sets A hexadecimal value for the timeline background colour. Defaults to #000000 (black).
     * @param {String} background A hexadecimal value for the timeline background colour. Defaults to #000000 (black).
     */
    public setBackground = (background: string) => {
        this.background = background;
        return this;
    };

    /**
     * @param {module:model/Soundtrack} soundtrack
     */
    public setSoundtrack = (soundtrack: Soundtrack) => {
        this.soundtrack = soundtrack;
        return this;
    };

    /**
     * Sets A timeline consists of an array of tracks, each track containing clips. Tracks are layered on top of each other in the same order they are added to the array with the top most track layered over the top of those below it. Ensure that a track containing titles is the top most track so that it is displayed above videos and images.
     * @param {Array.<module:model/Track>} tracks A timeline consists of an array of tracks, each track containing clips. Tracks are layered on top of each other in the same order they are added to the array with the top most track layered over the top of those below it. Ensure that a track containing titles is the top most track so that it is displayed above videos and images.
     */
    public setTracks = (tracks: Track[]) => {
        this._tracks = tracks;
        return this;
    };

    get tracks(): Track[] {
        if (this._tracks === undefined) {
            throw new Error("Tracks is undefined");
        }
        return this._tracks;
    }

    public setTitle = (title: string) => {
        this.title = title;
        return this;
    };
}

export default Timeline;
