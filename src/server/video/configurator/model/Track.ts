import type Clip from "./Clip";

class Track {
    private _clips?: Clip[];

    constructor(clips?: Clip[]) {
        this._clips = clips;
    }

    /**
     * Sets An array of Clips comprising of TitleClip, ImageClip or VideoClip.
     * @param {Array.<module:model/Clip>} clips An array of Clips comprising of TitleClip, ImageClip or VideoClip.
     */
    public setClips = (clips: Clip[]) => {
        this._clips = clips;
        return this;
    };
    get clips(): Clip[] {
        if (this._clips === undefined) {
            throw new Error("Clips is undefined");
        }
        return this._clips;
    }
}

export default Track;
