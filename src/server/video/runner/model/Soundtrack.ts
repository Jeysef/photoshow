import type SoundtrackModel from "../../configurator/model/Soundtrack";
import type { StreamLabel } from "../../types/types";

export class Soundtrack {
    soundtrack?: SoundtrackModel;
    label: string;

    constructor(label: StreamLabel, soundtrack?: SoundtrackModel) {
        this.soundtrack = soundtrack;
        this.label = label;
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
