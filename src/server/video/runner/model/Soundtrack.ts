import type SoundtrackModel from "../../configurator/model/Soundtrack";

export class Soundtrack {
    soundtrack?: SoundtrackModel;

    constructor(soundtrack?: SoundtrackModel) {
        this.soundtrack = soundtrack;
    }

    getInput() {
        if (!this.soundtrack?.src) {
            return undefined;
        }
        // console.log("soundtrack", this.soundtrack)
        // return ["-stream_loop", "-1", "-i", this.soundtrack.src]; // loop audio till the end of the video
        return {
            name: this.soundtrack.src,
            config: ["-stream_loop", "-1"],
        };
    }
}
