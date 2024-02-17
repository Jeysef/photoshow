import Big from "big.js";
import type Output from "../../configurator/model/Output";
import type RendererTrack from "../../configurator/model/Track";
import type { StreamLabel } from "../../types/types";
import Track, { type ITrackOutput } from "./Track";

export interface ITracksProps {
    tracks: RendererTrack[];
    background: string;
    output: Output;
}

export interface ITracksOutput extends ITrackOutput {
    tracksCount: number;
}

class Tracks {
    private readonly inputTracks: RendererTrack[];
    constructor(private props: ITracksProps) {
        this.inputTracks = this.props.tracks;
    }

    private getTracks(props: ITracksProps) {
        const inputTracks: Track[] = [];
        this.inputTracks.reduce(
            (accumulator, track, index) => {
                const newTrack = new Track({
                    track: track,
                    index: index,
                    background: props.background,
                    output: props.output,
                    prevTrack: accumulator,
                });
                inputTracks.push(newTrack);
                return newTrack;
            },
            undefined as Track | undefined,
        );
        return inputTracks;
    }

    /**
     * czech: vkládám podklady tak že poslední je nahoře a všechny předchozí jsou postupně pod ním
     */
    private overlayTracks(tracks: Track[], tracksOutput: ITrackOutput[]) {
        const value = tracks.reduceRight(
            (accumulator, track, currentIndex, tracks) => {
                const currentTrack = tracksOutput[currentIndex];
                if (!currentTrack) throw new Error("currentTrack is undefined");
                let overlay = {
                    script: "",
                    outputStreamLabel: currentTrack.outputStreamLabel,
                };
                if (currentIndex < tracks.length - 1) {
                    const previousTrack = tracks[currentIndex + 1];
                    if (!previousTrack) throw new Error("previousTrack is undefined");
                    // the previous track will be on top of the current track
                    overlay = track.overlayBy(previousTrack);
                }
                if (accumulator.script && overlay.script) {
                    overlay.script = ";" + overlay.script;
                }
                return {
                    script: accumulator.script + overlay.script,
                    outputStreamLabel: overlay.outputStreamLabel,
                };
            },
            {
                script: "",
                outputStreamLabel: "" as StreamLabel,
            },
        );
        if (!value.outputStreamLabel) throw new Error("outputStreamLabel is undefined. No tracks?");
        if (value.script) {
            value.script += ";";
        }
        return value;
    }

    public getOutput(): ITracksOutput {
        const tracks = this.getTracks(this.props);
        const tracksOutput = tracks.map((track) => track.getOutput());
        const overlay = this.overlayTracks(tracks, tracksOutput);
        /**
         * The duration of the final video is the duration of the longest track
         */
        const duration = tracksOutput.reduce((acc, curr) => (acc.gt(curr.duration) ? acc : curr.duration), Big(0));
        console.log("🚀 ~ file: Tracks.ts:86 ~ Tracks ~ getOutput ~ duration:", duration);
        return {
            assets: tracksOutput.map((track) => track.assets).flat(),
            script: tracksOutput.reduce((acc, curr) => acc + curr.script + ";", "") + overlay.script,
            outputStreamLabel: overlay.outputStreamLabel,
            tracksCount: tracks.length,
            clipsCount: tracksOutput.reduce((acc, curr) => acc + curr.clipsCount, 0),
            duration: duration,
        };
    }
}

export default Tracks;
