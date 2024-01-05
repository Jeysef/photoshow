import type Output from "./Output";
import type Timeline from "./Timeline";

class Edit {
    private _output?: Output;
    private _timeline?: Timeline;

    constructor(timeline?: Timeline, output?: Output) {
        this._timeline = timeline;
        this._output = output;
    }

    /**
     * @param {module:model/Timeline} timeline
     */
    public setTimeline = (timeline: Timeline) => {
        this._timeline = timeline;
        return this;
    };

    get timeline(): Timeline {
        if (this._timeline === undefined) {
            throw new Error("Timeline is undefined");
        }
        return this._timeline;
    }

    /**
     * @param {module:model/Output} output
     */
    public setOutput = (output: Output) => {
        this._output = output;
        return this;
    };

    get output(): Output {
        if (this._output === undefined) {
            throw new Error("Output is undefined");
        }
        return this._output;
    }
}

export default Edit;
