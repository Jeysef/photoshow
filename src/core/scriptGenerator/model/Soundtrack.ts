import type SoundtrackModel from "../../jsonGenerator/model/Soundtrack";

export class Soundtrack {
    soundtrack?: SoundtrackModel;

    constructor(soundtrack?: SoundtrackModel) {
        this.soundtrack = soundtrack;
    }

    getInput(): string[] {
        if (!this.soundtrack?.src) {
            return [];
        }
        // console.log("soundtrack", this.soundtrack)
        return ["-stream_loop", "-1", "-i", this.soundtrack.src]; // loop audio till the end of the video
    }
}
